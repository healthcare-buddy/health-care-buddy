import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ userId: string }>;
  }
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
        dischargeSummaries: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!patient) {
      return NextResponse.json([]);
    }

    return NextResponse.json(patient.dischargeSummaries);
  } catch (error) {
    console.error("Error fetching discharge summaries:", error);
    return NextResponse.json(
      { error: "Failed to fetch discharge summaries" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const summaryId = (await params).userId;

    await prisma.dischargeSummary.delete({
      where: { id: summaryId },
    });

    return NextResponse.json({ message: "Summary deleted successfully" });
  } catch (error) {
    console.error("Error deleting discharge summary:", error);
    return NextResponse.json(
      { error: "Failed to delete discharge summary" },
      { status: 500 }
    );
  }
}
