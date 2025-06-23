import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ summaryId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { summaryId } = await params;
    const followUpPlan = await prisma.followUpPlan.findFirst({
      where: { dischargeSummaryId: summaryId },
      include: {
        dischargeSummary: {
          select: {
            id: true,
            fileName: true,
            diagnosis: true,
          },
        },
        appointments: {
          orderBy: { scheduledDate: "asc" },
        },
        tests: {
          orderBy: { scheduledDate: "asc" },
        },
        vaccines: {
          orderBy: { scheduledDate: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!followUpPlan) {
      return NextResponse.json(
        { error: "Follow-up plan not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(followUpPlan);
  } catch (error) {
    console.error("Error fetching follow-up plan:", error);
    return NextResponse.json(
      { error: "Failed to fetch follow-up plan" },
      { status: 500 }
    );
  }
}
