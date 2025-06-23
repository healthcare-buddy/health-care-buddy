import { type NextRequest, NextResponse } from "next/server";

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

    // const { text, userId } = await request.json();
    const { text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this medical discharge summary text and extract the following information in JSON format:
    {
      "diagnosis": "Primary diagnosis and medical conditions (be specific and detailed)",
      "medications": "Complete list of prescribed medications with dosages, frequency, and duration",
      "treatmentSummary": "Detailed summary of treatments provided during hospital stay",
      "recoveryInstructions": "Specific post-discharge care instructions and recommendations",
      "followUpRequired": "Required follow-up appointments, tests, and medical consultations with timeframes",
      "restrictions": "Activity restrictions, dietary restrictions, and precautions"
    }

    Medical Text to analyze:
    ${text}

    Please provide accurate and detailed medical information extraction. If any section is not clearly mentioned in the text, indicate "Not specified in document" for that field. Be thorough and extract all relevant medical details.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Parse the JSON response
    let extractedData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to extract information from text" },
        { status: 500 }
      );
    }

    // Return extracted data without saving to database yet
    return NextResponse.json({
      extractedData,
      message: "Text processed successfully",
    });
  } catch (error) {
    console.error("Text processing error:", error);
    return NextResponse.json(
      { error: "Failed to process text" },
      { status: 500 }
    );
  }
}
