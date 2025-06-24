import jsPDF from "jspdf";

interface ProgressData {
  totalAppointments: number;
  completedAppointments: number;
  upcomingAppointments: number;
  overdueAppointments: number;
  totalTests: number;
  completedTests: number;
  pendingTests: number;
  totalVaccines: number;
  completedVaccines: number;
  activeMedications: number;
  medicationAdherence: number;
  appointments: Array<{
    id: string;
    type: string;
    description: string;
    scheduledDate: string;
    isCompleted: boolean;
  }>;
  tests: Array<{
    id: string;
    name: string;
    description: string;
    scheduledDate: string;
    isCompleted: boolean;
  }>;
}

interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  email: string;
}

export function generateProgressReportPDF(
  progressData: ProgressData,
  patientInfo: PatientInfo
): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = 30;

  // Helper function to add text with word wrapping
  const addWrappedText = (
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    fontSize = 12
  ): number => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
    doc.text(lines, x, y);
    return y + lines.length * fontSize * 0.4 + 5;
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number): number => {
    if (yPosition + requiredSpace > pageHeight - 30) {
      doc.addPage();
      return 30;
    }
    return yPosition;
  };

  // Header
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text("Healthcare Progress Report", margin, yPosition);
  yPosition += 20;

  // Patient Information
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Patient Information", margin, yPosition);
  yPosition += 12;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Name: ${patientInfo.name}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Age: ${patientInfo.age} years`, margin, yPosition);
  yPosition += 8;
  doc.text(`Gender: ${patientInfo.gender}`, margin, yPosition);
  yPosition += 8;
  doc.text(`Email: ${patientInfo.email}`, margin, yPosition);
  yPosition += 8;
  doc.text(
    `Report Generated: ${new Date().toLocaleDateString()}`,
    margin,
    yPosition
  );
  yPosition += 20;

  // Progress Summary
  yPosition = checkNewPage(80);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Progress Summary", margin, yPosition);
  yPosition += 15;

  // Create summary table
  const summaryData = [
    ["Metric", "Completed", "Total", "Percentage"],
    [
      "Appointments",
      progressData.completedAppointments.toString(),
      progressData.totalAppointments.toString(),
      progressData.totalAppointments > 0
        ? `${Math.round(
            (progressData.completedAppointments /
              progressData.totalAppointments) *
              100
          )}%`
        : "0%",
    ],
    [
      "Tests & Diagnostics",
      progressData.completedTests.toString(),
      progressData.totalTests.toString(),
      progressData.totalTests > 0
        ? `${Math.round(
            (progressData.completedTests / progressData.totalTests) * 100
          )}%`
        : "0%",
    ],
    [
      "Vaccinations",
      progressData.completedVaccines.toString(),
      progressData.totalVaccines.toString(),
      progressData.totalVaccines > 0
        ? `${Math.round(
            (progressData.completedVaccines / progressData.totalVaccines) * 100
          )}%`
        : "0%",
    ],
    ["Medication Adherence", "-", "-", `${progressData.medicationAdherence}%`],
  ];

  // Draw table
  const cellHeight = 8;
  const colWidths = [60, 30, 30, 30];
  let tableY = yPosition;

  summaryData.forEach((row, rowIndex) => {
    let cellX = margin;
    row.forEach((cell, colIndex) => {
      // Draw cell border
      doc.rect(cellX, tableY, colWidths[colIndex], cellHeight);

      // Set font style for header row
      if (rowIndex === 0) {
        doc.setFont("helvetica", "bold");
        doc.setFillColor(240, 240, 240);
        doc.rect(cellX, tableY, colWidths[colIndex], cellHeight, "F");
      } else {
        doc.setFont("helvetica", "normal");
      }

      // Add text
      doc.text(cell, cellX + 2, tableY + 5);
      cellX += colWidths[colIndex];
    });
    tableY += cellHeight;
  });

  yPosition = tableY + 20;

  // Key Metrics
  yPosition = checkNewPage(60);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Key Metrics", margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(
    `• Active Medications: ${progressData.activeMedications}`,
    margin,
    yPosition
  );
  yPosition += 8;
  doc.text(
    `• Upcoming Appointments: ${progressData.upcomingAppointments}`,
    margin,
    yPosition
  );
  yPosition += 8;
  doc.text(
    `• Overdue Appointments: ${progressData.overdueAppointments}`,
    margin,
    yPosition
  );
  yPosition += 8;
  doc.text(`• Pending Tests: ${progressData.pendingTests}`, margin, yPosition);
  yPosition += 20;

  // Appointments Detail
  if (progressData.appointments.length > 0) {
    yPosition = checkNewPage(40);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Appointments", margin, yPosition);
    yPosition += 15;

    progressData.appointments.forEach((appointment) => {
      yPosition = checkNewPage(25);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${appointment.type}`, margin, yPosition);
      yPosition += 8;

      doc.setFont("helvetica", "normal");
      doc.text(
        `Date: ${new Date(appointment.scheduledDate).toLocaleDateString()}`,
        margin + 10,
        yPosition
      );
      yPosition += 6;
      doc.text(
        `Status: ${appointment.isCompleted ? "Completed" : "Pending"}`,
        margin + 10,
        yPosition
      );
      yPosition += 6;

      if (appointment.description) {
        yPosition = addWrappedText(
          appointment.description,
          margin + 10,
          yPosition,
          maxWidth - 10,
          10
        );
      }
      yPosition += 8;
    });
  }

  // Tests Detail
  if (progressData.tests.length > 0) {
    yPosition = checkNewPage(40);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Tests & Diagnostics", margin, yPosition);
    yPosition += 15;

    progressData.tests.forEach((test) => {
      yPosition = checkNewPage(25);
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`${test.name}`, margin, yPosition);
      yPosition += 8;

      doc.setFont("helvetica", "normal");
      doc.text(
        `Date: ${new Date(test.scheduledDate).toLocaleDateString()}`,
        margin + 10,
        yPosition
      );
      yPosition += 6;
      doc.text(
        `Status: ${test.isCompleted ? "Completed" : "Pending"}`,
        margin + 10,
        yPosition
      );
      yPosition += 6;

      if (test.description) {
        yPosition = addWrappedText(
          test.description,
          margin + 10,
          yPosition,
          maxWidth - 10,
          10
        );
      }
      yPosition += 8;
    });
  }

  // Recommendations
  yPosition = checkNewPage(60);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("Recommendations", margin, yPosition);
  yPosition += 15;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const recommendations = [];

  if (progressData.overdueAppointments > 0) {
    recommendations.push(
      `• Schedule ${progressData.overdueAppointments} overdue appointment(s) immediately`
    );
  }

  if (progressData.pendingTests > 0) {
    recommendations.push(
      `• Complete ${progressData.pendingTests} pending test(s)`
    );
  }

  if (progressData.medicationAdherence < 80) {
    recommendations.push(
      "• Improve medication adherence - consider setting up reminders"
    );
  }

  if (
    progressData.upcomingAppointments === 0 &&
    progressData.totalAppointments > 0
  ) {
    recommendations.push("• Schedule follow-up appointments as recommended");
  }

  if (recommendations.length === 0) {
    recommendations.push("• Continue following your current treatment plan");
    recommendations.push(
      "• Maintain regular communication with your healthcare provider"
    );
  }

  recommendations.forEach((rec) => {
    yPosition = addWrappedText(rec, margin, yPosition, maxWidth, 12);
    yPosition += 5;
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Healthcare Buddy - Progress Report - Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      {
        align: "center",
      }
    );
  }

  // Download the PDF
  const fileName = `progress-report-${patientInfo.name.replace(/\s+/g, "-")}-${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
}
