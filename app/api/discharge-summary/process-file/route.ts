// import { type NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { prisma } from "@/lib/prisma";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(request: NextRequest) {
//   try {
//     const session = await auth.api.getSession({
//       headers: await headers(),
//     });

//     if (!session) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const formData = await request.formData();
//     const file = formData.get("file") as File;
//     const userId = formData.get("userId") as string;

//     if (!file) {
//       return NextResponse.json({ error: "No file provided" }, { status: 400 });
//     }

//     // Convert file to base64 for Gemini
//     const bytes = await file.arrayBuffer();
//     const buffer = Buffer.from(bytes);
//     const base64 = buffer.toString("base64");

//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const prompt = `
//     Analyze this medical discharge summary document and extract the following information in JSON format:
//     {
//       "diagnosis": "Primary diagnosis and medical conditions (be specific and detailed)",
//       "medications": "Complete list of prescribed medications with dosages, frequency, and duration",
//       "treatmentSummary": "Detailed summary of treatments provided during hospital stay",
//       "recoveryInstructions": "Specific post-discharge care instructions and recommendations",
//       "followUpRequired": "Required follow-up appointments, tests, and medical consultations with timeframes",
//       "restrictions": "Activity restrictions, dietary restrictions, and precautions"
//     }

//     Please provide accurate and detailed medical information extraction. If any section is not clearly mentioned in the document, indicate "Not specified in document" for that field. Be thorough and extract all relevant medical details.
//     `;

//     const imagePart = {
//       inlineData: {
//         data: base64,
//         mimeType: file.type,
//       },
//     };

//     const result = await model.generateContent([prompt, imagePart]);
//     const response = await result.response;
//     const text = response.text();

//     // Parse the JSON response
//     let extractedData;
//     try {
//       // Clean the response to extract JSON
//       const jsonMatch = text.match(/\{[\s\S]*\}/);
//       if (jsonMatch) {
//         extractedData = JSON.parse(jsonMatch[0]);
//       } else {
//         throw new Error("No JSON found in response");
//       }
//     } catch (parseError) {
//       console.error("Failed to parse AI response:", parseError);
//       return NextResponse.json(
//         { error: "Failed to extract information from document" },
//         { status: 500 }
//       );
//     }

//     // Get patient
//     const patient = await prisma.patient.findUnique({
//       where: { userId },
//     });

//     if (!patient) {
//       return NextResponse.json(
//         { error: "Patient profile not found" },
//         { status: 404 }
//       );
//     }

//     // Save the discharge summary to database
//     const dischargeSummary = await prisma.dischargeSummary.create({
//       data: {
//         patientId: patient.id,
//         fileName: file.name,
//         fileUrl: `/uploads/${file.name}`, // You might want to implement actual file storage
//         diagnosis: extractedData.diagnosis,
//         medications: extractedData.medications,
//         treatmentSummary: extractedData.treatmentSummary,
//         recoveryInstructions: extractedData.recoveryInstructions,
//         followUpRequired: extractedData.followUpRequired || "Not specified",
//         restrictions: extractedData.restrictions || "Not specified",
//       },
//     });

//     return NextResponse.json({
//       extractedData,
//       summaryId: dischargeSummary.id,
//       message: "Document processed successfully",
//     });
//   } catch (error) {
//     console.error("Document processing error:", error);
//     return NextResponse.json(
//       { error: "Failed to process document" },
//       { status: 500 }
//     );
//   }
// }

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
      "diagnosis": "Primary diagnosis and medical conditions (be specific and detailed)",
      "medications": "Complete list of prescribed medications with dosages, frequency, and duration",
      "treatmentSummary": "Detailed summary of treatments provided during hospital stay",
      "recoveryInstructions": "Specific post-discharge care instructions and recommendations",
      "followUpRequired": "Required follow-up appointments, tests, and medical consultations with timeframes",
      "restrictions": "Activity restrictions, dietary restrictions, and precautions"
    }

    Please provide accurate and detailed medical information extraction. If any section is not clearly mentioned in the document, indicate "Not specified in document" for that field. Be thorough and extract all relevant medical details.
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
    let extractedData;
    try {
      // Clean the response to extract JSON
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      return NextResponse.json(
        { error: "Failed to extract information from document" },
        { status: 500 }
      );
    }

    // Return extracted data without saving to database yet
    return NextResponse.json({
      extractedData,
      message: "Document processed successfully",
    });
  } catch (error) {
    console.error("Document processing error:", error);
    return NextResponse.json(
      { error: "Failed to process document" },
      { status: 500 }
    );
  }
}
