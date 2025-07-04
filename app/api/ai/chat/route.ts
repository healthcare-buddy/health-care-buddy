import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenAI } from "@google/genai";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

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

    // Use streaming for real-time response
    const streamResult = await genAI.models.generateContentStream({
      model: "gemini-2.0-flash",
      contents: context,
    });

    // Create a ReadableStream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        try {
          for await (const chunk of streamResult) {
            const text = chunk.candidates?.[0]?.content?.parts?.[0]?.text || "";
            if (text) {
              const data = `data: ${JSON.stringify({ text })}\n\n`;
              controller.enqueue(encoder.encode(data));
            }
          }

          // Send end signal
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
        } catch (error) {
          console.error("Streaming error:", error);
          const errorData = `data: ${JSON.stringify({
            error: "Stream error occurred",
          })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI Chat error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    );
  }
}
