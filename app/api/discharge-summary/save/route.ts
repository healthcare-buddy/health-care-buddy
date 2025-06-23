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

    const { userId, extractedData, fileName } = await request.json();

    // Get patient
    const patient = await prisma.patient.findUnique({
      where: { userId },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    // Save the discharge summary to database
    const dischargeSummary = await prisma.dischargeSummary.create({
      data: {
        patientId: patient.id,
        fileName: fileName || "Manual Entry",
        fileUrl: fileName ? `/uploads/${fileName}` : "",
        diagnosis: extractedData.diagnosis,
        medications: extractedData.medications,
        treatmentSummary: extractedData.treatmentSummary,
        recoveryInstructions: extractedData.recoveryInstructions,
        followUpRequired: extractedData.followUpRequired || "Not specified",
        restrictions: extractedData.restrictions || "Not specified",
      },
    });

    return NextResponse.json({
      success: true,
      summaryId: dischargeSummary.id,
      message: "Discharge summary saved successfully",
    });
  } catch (error) {
    console.error("Error saving discharge summary:", error);
    return NextResponse.json(
      { error: "Failed to save discharge summary" },
      { status: 500 }
    );
  }
}
