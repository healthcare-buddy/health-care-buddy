import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { dischargeSummaryId, followUpPlan } = await request.json();

    // Get patient ID
    const patient = await prisma.patient.findUnique({
      where: { userId: session.user.id },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Create follow-up plan
    const savedPlan = await prisma.followUpPlan.create({
      data: {
        patientId: patient.id,
        dischargeSummaryId,
        isConfirmed: false,
      },
    });

    // Save appointments
    if (followUpPlan.appointments) {
      for (const appointment of followUpPlan.appointments) {
        const scheduledDate = new Date();
        scheduledDate.setDate(
          scheduledDate.getDate() +
            getTimeframeDays(appointment.recommendedTimeframe)
        );

        await prisma.appointment.create({
          data: {
            followUpPlanId: savedPlan.id,
            type: appointment.type,
            description: appointment.description,
            scheduledDate,
          },
        });
      }
    }

    // Save tests
    if (followUpPlan.tests) {
      for (const test of followUpPlan.tests) {
        const scheduledDate = new Date();
        scheduledDate.setDate(
          scheduledDate.getDate() + getTimeframeDays(test.recommendedTimeframe)
        );

        await prisma.test.create({
          data: {
            followUpPlanId: savedPlan.id,
            name: test.name,
            description: test.description,
            scheduledDate,
          },
        });
      }
    }

    // Save vaccines
    if (followUpPlan.vaccines) {
      for (const vaccine of followUpPlan.vaccines) {
        const scheduledDate = new Date();
        scheduledDate.setDate(
          scheduledDate.getDate() +
            getTimeframeDays(vaccine.recommendedTimeframe)
        );

        await prisma.vaccine.create({
          data: {
            followUpPlanId: savedPlan.id,
            name: vaccine.name,
            description: vaccine.description,
            scheduledDate,
          },
        });
      }
    }

    // Save medications
    if (followUpPlan.medications) {
      for (const medication of followUpPlan.medications) {
        await prisma.medication.create({
          data: {
            patientId: patient.id,
            name: medication.name,
            dosage: medication.dosage,
            frequency: medication.frequency,
            duration: medication.duration,
            instructions: medication.instructions,
            sideEffects: medication.sideEffects,
          },
        });
      }
    }

    return NextResponse.json({ success: true, planId: savedPlan.id });
  } catch (error) {
    console.error("Error saving follow-up plan:", error);
    return NextResponse.json(
      { error: "Failed to save follow-up plan" },
      { status: 500 }
    );
  }
}

function getTimeframeDays(timeframe: string): number {
  const lower = timeframe.toLowerCase();
  if (lower.includes("week")) {
    const weeks = Number.parseInt(lower.match(/\d+/)?.[0] || "1");
    return weeks * 7;
  } else if (lower.includes("month")) {
    const months = Number.parseInt(lower.match(/\d+/)?.[0] || "1");
    return months * 30;
  } else if (lower.includes("day")) {
    return Number.parseInt(lower.match(/\d+/)?.[0] || "7");
  }
  return 7; // Default to 1 week
}
