import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { message, language, userId } = await request.json();

    // Get patient data for context
    const patient = await prisma.patient.findUnique({
      where: { userId },
      include: {
        medications: { where: { isActive: true } },
        followUpPlans: {
          include: {
            appointments: true,
            tests: true,
            vaccines: true,
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        dischargeSummaries: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: "Patient profile not found" },
        { status: 404 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    // Build context for the AI
    const context = `
    You are a helpful AI healthcare assistant. You are speaking with a patient who has the following medical information:

    Patient Age: ${patient.age}
    Patient Gender: ${patient.gender}
    Preferred Language: ${language}

    Recent Diagnosis: ${
      patient.dischargeSummaries[0]?.diagnosis || "No recent diagnosis"
    }
    
    Current Medications: ${
      patient.medications
        .map((med) => `${med.name} (${med.dosage}, ${med.frequency})`)
        .join(", ") || "No active medications"
    }
    
    Upcoming Appointments: ${
      patient.followUpPlans[0]?.appointments
        .filter((apt) => !apt.isCompleted)
        .map(
          (apt) =>
            `${apt.type} on ${new Date(apt.scheduledDate).toLocaleDateString()}`
        )
        .join(", ") || "No upcoming appointments"
    }
    
    Pending Tests: ${
      patient.followUpPlans[0]?.tests
        .filter((test) => !test.isCompleted)
        .map(
          (test) =>
            `${test.name} scheduled for ${new Date(
              test.scheduledDate
            ).toLocaleDateString()}`
        )
        .join(", ") || "No pending tests"
    }

    Please respond in ${language} language. Be helpful, accurate, and empathetic. Only provide medical information based on the patient's records. Do not diagnose or provide medical advice beyond what's in their records.

    Patient's question: ${message}
    `;

    const result = await model.generateContent(context);
    const response = await result.response;
    const aiResponse = response.text();

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
