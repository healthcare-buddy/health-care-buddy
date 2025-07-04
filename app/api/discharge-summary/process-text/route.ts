import { type NextRequest, NextResponse } from "next/server";

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

    const { text } = await request.json();

    if (!text || !text.trim()) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const prompt = `
Analyze this medical discharge summary text and extract the following information in JSON format:
{
  "diagnosis": "Primary diagnosis and medical conditions (be specific and detailed)",
  "medications": "Complete list of prescribed medications with dosages, frequency, and duration as a single text string",
  "treatmentSummary": "Detailed summary of treatments provided during hospital stay as a single text string",
  "recoveryInstructions": "Specific post-discharge care instructions and recommendations as a single text string",
  "followUpRequired": "Required follow-up appointments, tests, and medical consultations with timeframes as a single text string",
  "restrictions": "Activity restrictions, dietary restrictions, and precautions as a single text string"
}

IMPORTANT: 
- All values must be strings, not objects or arrays
- If medications are listed separately, combine them into a single descriptive text
- If any section is not clearly mentioned in the text, use "Not specified in document"
- Do not use nested objects or arrays in the response
- Ensure all field values are plain text strings

Medical Text to analyze:
${text}
`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const aiResponse =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Failed to generate response";

    // Parse the JSON response
    let extractedData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsedData = JSON.parse(jsonMatch[0]);

        // Ensure all values are strings and not objects/arrays
        extractedData = {
          diagnosis:
            typeof parsedData.diagnosis === "string"
              ? parsedData.diagnosis
              : JSON.stringify(
                  parsedData.diagnosis || "Not specified in document"
                ),
          medications:
            typeof parsedData.medications === "string"
              ? parsedData.medications
              : JSON.stringify(
                  parsedData.medications || "Not specified in document"
                ),
          treatmentSummary:
            typeof parsedData.treatmentSummary === "string"
              ? parsedData.treatmentSummary
              : JSON.stringify(
                  parsedData.treatmentSummary || "Not specified in document"
                ),
          recoveryInstructions:
            typeof parsedData.recoveryInstructions === "string"
              ? parsedData.recoveryInstructions
              : JSON.stringify(
                  parsedData.recoveryInstructions || "Not specified in document"
                ),
          followUpRequired:
            typeof parsedData.followUpRequired === "string"
              ? parsedData.followUpRequired
              : JSON.stringify(
                  parsedData.followUpRequired || "Not specified in document"
                ),
          restrictions:
            typeof parsedData.restrictions === "string"
              ? parsedData.restrictions
              : JSON.stringify(
                  parsedData.restrictions || "Not specified in document"
                ),
        };
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("AI Response:", aiResponse);

      // Fallback: create a basic structure from the text
      extractedData = {
        diagnosis:
          "Unable to parse diagnosis from text. Please review manually.",
        medications:
          "Unable to parse medications from text. Please review manually.",
        treatmentSummary:
          "Unable to parse treatment summary from text. Please review manually.",
        recoveryInstructions:
          "Unable to parse recovery instructions from text. Please review manually.",
        followUpRequired:
          "Unable to parse follow-up requirements from text. Please review manually.",
        restrictions:
          "Unable to parse restrictions from text. Please review manually.",
      };
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
