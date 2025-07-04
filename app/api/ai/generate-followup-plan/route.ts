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

    const { dischargeSummaryId, patientAge, patientGender } =
      await request.json();

    // Get discharge summary
    const dischargeSummary = await prisma.dischargeSummary.findUnique({
      where: { id: dischargeSummaryId },
    });

    if (!dischargeSummary) {
      return NextResponse.json(
        { error: "Discharge summary not found" },
        { status: 404 }
      );
    }

    const prompt = `
    Based on this medical discharge summary, generate a comprehensive follow-up care plan for a ${patientAge}-year-old ${patientGender} patient:

    Diagnosis: ${dischargeSummary.diagnosis}
    Medications: ${dischargeSummary.medications}
    Treatment Summary: ${dischargeSummary.treatmentSummary}
    Recovery Instructions: ${dischargeSummary.recoveryInstructions}

    Generate a follow-up plan in JSON format with the following structure:
    {
      "appointments": [
        {
          "type": "Follow-up appointment type",
          "description": "Detailed description",
          "recommendedTimeframe": "When this should be scheduled (e.g., '1 week', '2 weeks')",
          "priority": "HIGH/MEDIUM/LOW"
        }
      ],
      "tests": [
        {
          "name": "Test name",
          "description": "Why this test is needed",
          "recommendedTimeframe": "When this should be done",
          "priority": "HIGH/MEDIUM/LOW"
        }
      ],
      "vaccines": [
        {
          "name": "Vaccine name",
          "description": "Why this vaccine is recommended",
          "recommendedTimeframe": "When this should be administered",
          "priority": "HIGH/MEDIUM/LOW"
        }
      ],
      "medications": [
        {
          "name": "Medication name",
          "dosage": "Dosage amount",
          "frequency": "How often to take",
          "duration": "How long to take",
          "instructions": "Special instructions",
          "sideEffects": "Potential side effects to watch for"
        }
      ]
    }

    Base recommendations on current medical guidelines and the specific condition. Include realistic timeframes and priorities.
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Failed to generate response";

    // Parse the JSON response
    let followUpPlan;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        followUpPlan = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to generate follow-up plan" },
        { status: 500 }
      );
    }

    return NextResponse.json({ followUpPlan });
  } catch (error) {
    console.error("Follow-up plan generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate follow-up plan" },
      { status: 500 }
    );
  }
}
