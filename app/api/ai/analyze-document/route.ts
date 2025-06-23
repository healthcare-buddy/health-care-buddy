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

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert file to base64 for Gemini
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Analyze this medical discharge summary document and extract the following information in JSON format:
    {
      "diagnosis": "Primary diagnosis and conditions",
      "medications": "List of prescribed medications with dosages",
      "treatmentSummary": "Summary of treatments provided during hospital stay",
      "recoveryInstructions": "Post-discharge care instructions and recommendations",
      "followUpRequired": "Required follow-up appointments and tests",
      "restrictions": "Activity restrictions and precautions"
    }

    Please provide accurate medical information extraction. If any section is not clearly mentioned, indicate "Not specified in document".
    `;

    const imagePart = {
      inlineData: {
        data: base64,
        mimeType: file.type,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the JSON response
    let analysisResult;
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.log("Error parsing JSON:", parseError);

      analysisResult = {
        diagnosis: "Unable to parse diagnosis from document",
        medications: "Unable to parse medications from document",
        treatmentSummary: "Unable to parse treatment summary from document",
        recoveryInstructions:
          "Unable to parse recovery instructions from document",
        followUpRequired:
          "Unable to parse follow-up requirements from document",
        restrictions: "Unable to parse restrictions from document",
      };
    }

    return NextResponse.json({ analysis: analysisResult });
  } catch (error) {
    console.error("Document analysis error:", error);
    return NextResponse.json(
      { error: "Failed to analyze document" },
      { status: 500 }
    );
  }
}
