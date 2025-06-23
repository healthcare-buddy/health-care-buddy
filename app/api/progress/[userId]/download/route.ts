/* eslint-disable */
/* @ts-nocheck */

import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (await params).userId;

    const patient = await prisma.patient.findUnique({
      where: { userId: userId },
      include: {
        user: true,
        followUpPlans: {
          include: {
            appointments: true,
            tests: true,
            vaccines: true,
          },
          orderBy: { createdAt: "desc" },
        },
        medications: {
          where: { isActive: true },
        },
        dischargeSummaries: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Generate PDF content (simplified HTML that can be converted to PDF)
    const htmlContent = generateProgressReportHTML(patient);

    // In a real application, you would use a library like puppeteer or jsPDF
    // For this example, we'll return the HTML content as a simple PDF-like response
    const pdfBuffer = Buffer.from(htmlContent, "utf-8");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="progress-report-${
          new Date().toISOString().split("T")[0]
        }.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating progress report:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}

function generateProgressReportHTML(patient: any): string {
  const allAppointments = patient.followUpPlans.flatMap(
    (plan: any) => plan.appointments
  );
  const allTests = patient.followUpPlans.flatMap((plan: any) => plan.tests);
  const completedAppointments = allAppointments.filter(
    (apt: any) => apt.isCompleted
  ).length;
  const completedTests = allTests.filter(
    (test: any) => test.isCompleted
  ).length;

  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Healthcare Progress Report</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .stats { display: flex; justify-content: space-around; margin: 20px 0; }
            .stat-box { text-align: center; padding: 15px; border: 1px solid #ddd; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>Healthcare Progress Report</h1>
            <p>Patient: ${patient.user.name}</p>
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section">
            <h2>Progress Summary</h2>
            <div class="stats">
                <div class="stat-box">
                    <h3>${completedAppointments}/${allAppointments.length}</h3>
                    <p>Appointments Completed</p>
                </div>
                <div class="stat-box">
                    <h3>${completedTests}/${allTests.length}</h3>
                    <p>Tests Completed</p>
                </div>
                <div class="stat-box">
                    <h3>${patient.medications.length}</h3>
                    <p>Active Medications</p>
                </div>
            </div>
        </div>

        <div class="section">
            <h2>Appointments</h2>
            <table>
                <tr>
                    <th>Type</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
                ${allAppointments
                  .map(
                    (apt: any) => `
                    <tr>
                        <td>${apt.type}</td>
                        <td>${new Date(
                          apt.scheduledDate
                        ).toLocaleDateString()}</td>
                        <td>${apt.isCompleted ? "Completed" : "Pending"}</td>
                    </tr>
                `
                  )
                  .join("")}
            </table>
        </div>

        <div class="section">
            <h2>Tests & Diagnostics</h2>
            <table>
                <tr>
                    <th>Test Name</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>
                ${allTests
                  .map(
                    (test: any) => `
                    <tr>
                        <td>${test.name}</td>
                        <td>${new Date(
                          test.scheduledDate
                        ).toLocaleDateString()}</td>
                        <td>${test.isCompleted ? "Completed" : "Pending"}</td>
                    </tr>
                `
                  )
                  .join("")}
            </table>
        </div>

        <div class="section">
            <h2>Current Medications</h2>
            <table>
                <tr>
                    <th>Medication</th>
                    <th>Dosage</th>
                    <th>Frequency</th>
                </tr>
                ${patient.medications
                  .map(
                    (med: any) => `
                    <tr>
                        <td>${med.name}</td>
                        <td>${med.dosage}</td>
                        <td>${med.frequency}</td>
                    </tr>
                `
                  )
                  .join("")}
            </table>
        </div>
    </body>
    </html>
  `;
}
