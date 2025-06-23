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

    const { userId } = await params;

    const patient = await prisma.patient.findUnique({
      where: { userId: userId },
      include: {
        medications: {
          where: { isActive: true },
          include: {
            reminders: true,
            tracking: {
              where: {
                date: {
                  gte: new Date(
                    new Date().getTime() - 30 * 24 * 60 * 60 * 1000
                  ), // Last 30 days
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!patient) {
      return NextResponse.json([]);
    }

    // Transform medications to include calculated fields
    const medicationsWithExtras = patient.medications.map((med) => {
      // Create dailyTaken object from tracking data
      const dailyTaken: { [date: string]: boolean } = {};
      med.tracking.forEach((track) => {
        const dateKey = track.date.toISOString().split("T")[0];
        dailyTaken[dateKey] = track.taken;
      });

      return {
        ...med,
        priority: med.priority || "MEDIUM",
        dailyTaken,
        remainingDays: calculateRemainingDays(
          med.duration,
          med.createdAt.toISOString()
        ),
      };
    });

    return NextResponse.json(medicationsWithExtras);
  } catch (error) {
    console.error("Error fetching medications:", error);
    return NextResponse.json(
      { error: "Failed to fetch medications" },
      { status: 500 }
    );
  }
}

function calculateRemainingDays(duration: string, createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date();
  const daysPassed = Math.floor(
    (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
  );

  const durationMatch = duration.match(/(\d+)/);
  const totalDays = durationMatch ? Number.parseInt(durationMatch[1]) : 0;

  return Math.max(0, totalDays - daysPassed);
}
