import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Gender, Language } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const age = Number.parseInt(formData.get("age") as string);
    const gender = formData.get("gender") as string;
    const phone = formData.get("phone") as string;
    const language = formData.get("language") as string;
    const dischargeSummary = formData.get("dischargeSummary") as File;

    // Update or create patient record
    const patient = await prisma.patient.upsert({
      where: { userId: session.user.id },
      update: {
        age,
        gender: gender as Gender,
        phone,
        language: language as Language,
      },
      create: {
        userId: session.user.id,
        age,
        gender: gender as Gender,
        phone,
        language: language as Language,
      },
    });

    // Handle file upload and AI analysis if provided
    if (dischargeSummary && dischargeSummary.size > 0) {
      // Analyze document with AI
      const analysisFormData = new FormData();
      analysisFormData.append("file", dischargeSummary);

      const analysisResponse = await fetch(
        `${process.env.NEXTAUTH_URL}/api/ai/analyze-document`,
        {
          method: "POST",
          body: analysisFormData,
          headers: {
            Cookie: request.headers.get("cookie") || "",
          },
        }
      );

      if (analysisResponse.ok) {
        const { analysis } = await analysisResponse.json();

        // Store the analyzed discharge summary
        await prisma.dischargeSummary.create({
          data: {
            patientId: patient.id,
            fileName: dischargeSummary.name,
            fileUrl: `/uploads/${dischargeSummary.name}`, // Placeholder URL
            diagnosis: analysis.diagnosis,
            medications: analysis.medications,
            treatmentSummary: analysis.treatmentSummary,
            recoveryInstructions: analysis.recoveryInstructions,
          },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating patient:", error);
    return NextResponse.json(
      { error: "Failed to update patient" },
      { status: 500 }
    );
  }
}
