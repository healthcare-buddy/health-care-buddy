import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (await params).userId;

    const patient = await prisma.patient.findUnique({
      where: { userId: userId },
      include: {
        followUpPlans: {
          include: {
            appointments: true,
            tests: true,
            vaccines: true,
          },
          orderBy: { createdAt: "desc" },
        },
        medications: {
          where: { isActive: true },
        },
      },
    });

    if (!patient) {
      return NextResponse.json(null);
    }

    // Calculate progress metrics
    const allAppointments = patient.followUpPlans.flatMap(
      (plan) => plan.appointments
    );
    const allTests = patient.followUpPlans.flatMap((plan) => plan.tests);
    const allVaccines = patient.followUpPlans.flatMap((plan) => plan.vaccines);

    const completedAppointments = allAppointments.filter(
      (apt) => apt.isCompleted
    ).length;
    const totalAppointments = allAppointments.length;
    const upcomingAppointments = allAppointments.filter(
      (apt) => !apt.isCompleted && new Date(apt.scheduledDate) > new Date()
    ).length;
    const overdueAppointments = allAppointments.filter(
      (apt) => !apt.isCompleted && new Date(apt.scheduledDate) < new Date()
    ).length;

    const completedTests = allTests.filter((test) => test.isCompleted).length;
    const totalTests = allTests.length;
    const pendingTests = allTests.filter((test) => !test.isCompleted).length;

    const completedVaccines = allVaccines.filter(
      (vaccine) => vaccine.isCompleted
    ).length;
    const totalVaccines = allVaccines.length;

    const activeMedications = patient.medications.length;
    const medicationAdherence = activeMedications > 0 ? 85 : 0; // Placeholder calculation

    return NextResponse.json({
      totalAppointments,
      completedAppointments,
      upcomingAppointments,
      overdueAppointments,
      totalTests,
      completedTests,
      pendingTests,
      totalVaccines,
      completedVaccines,
      activeMedications,
      medicationAdherence,
      appointments: allAppointments,
      tests: allTests,
    });
  } catch (error) {
    console.error("Error fetching progress data:", error);
    return NextResponse.json(
      { error: "Failed to fetch progress data" },
      { status: 500 }
    );
  }
}
