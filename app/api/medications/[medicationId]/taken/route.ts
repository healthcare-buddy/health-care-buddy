import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ medicationId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, taken } = await request.json();

    const { medicationId } = await params;

    // Create or update medication tracking record
    await prisma.medicationTracking.upsert({
      where: {
        medicationId_date: {
          medicationId: medicationId,
          date: new Date(date),
        },
      },
      update: {
        taken,
        takenAt: taken ? new Date() : null,
      },
      create: {
        medicationId: medicationId,
        date: new Date(date),
        taken,
        takenAt: taken ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating medication taken status:", error);
    return NextResponse.json(
      { error: "Failed to update status" },
      { status: 500 }
    );
  }
}
