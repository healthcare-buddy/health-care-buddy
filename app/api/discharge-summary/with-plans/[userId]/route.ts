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
        dischargeSummaries: {
          include: {
            followUpPlans: {
              select: {
                id: true,
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

    // Transform the data to include hasFollowUpPlan flag
    const summariesWithPlanStatus = patient.dischargeSummaries.map(
      (summary) => ({
        id: summary.id,
        fileName: summary.fileName,
        diagnosis: summary.diagnosis,
        createdAt: summary.createdAt,
        hasFollowUpPlan: summary.followUpPlans.length > 0,
      })
    );

    return NextResponse.json(summariesWithPlanStatus);
  } catch (error) {
    console.error("Error fetching discharge summaries with plans:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
