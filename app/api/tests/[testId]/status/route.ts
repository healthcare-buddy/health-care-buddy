import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ testId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { status } = await request.json();

    const { testId } = await params;

    await prisma.test.update({
      where: { id: testId },
      data: {
        isCompleted: status === "COMPLETED",
        results: status === "SKIPPED" ? "Skipped by patient" : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating test status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
