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
  let yPosition = 20;

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

  // Enhanced Header with blue background
  doc.setFillColor(59, 130, 246); // Blue background
  doc.rect(0, 0, pageWidth, 45, "F");

  // Healthcare Buddy Logo/Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255); // White text
  doc.text("Healthcare Buddy", margin, yPosition + 15);

  doc.setFontSize(16);
  doc.setFont("helvetica", "normal");
  doc.text("Progress Report", margin, yPosition + 30);

  yPosition += 50;

  // Patient Information with styled box
  yPosition = checkNewPage(60);

  // Section header with gradient-like effect
  doc.setFillColor(249, 250, 251); // Light gray background
  doc.setDrawColor(229, 231, 235); // Gray border
  doc.rect(margin, yPosition, maxWidth, 50, "FD");

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(55, 65, 81); // Dark gray
  doc.text("👤 Patient Information", margin + 5, yPosition + 12);

  yPosition += 20;
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(75, 85, 99); // Medium gray

  doc.text(`Name: ${patientInfo.name}`, margin + 10, yPosition);
  yPosition += 8;
  doc.text(`Age: ${patientInfo.age} years`, margin + 10, yPosition);
  yPosition += 8;
  doc.text(`Gender: ${patientInfo.gender}`, margin + 10, yPosition);
  yPosition += 8;
  doc.text(`Email: ${patientInfo.email}`, margin + 10, yPosition);
  yPosition += 8;
  doc.text(
    `Report Generated: ${new Date().toLocaleDateString()}`,
    margin + 10,
    yPosition
  );
  yPosition += 25;

  // Progress Summary with enhanced styling
  yPosition = checkNewPage(100);

  // Section header with colored background
  doc.setFillColor(34, 197, 94); // Green background
  doc.rect(margin, yPosition, maxWidth, 15, "F");

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255); // White text
  doc.text("📊 Progress Summary", margin + 5, yPosition + 10);
  yPosition += 20;

  // Enhanced summary table with better styling
  const summaryData = [
    ["Metric", "Completed", "Total", "Progress"],
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

  // Draw enhanced table with colors
  const cellHeight = 10;
  const colWidths = [65, 32, 32, 32];
  let tableY = yPosition;

  summaryData.forEach((row, rowIndex) => {
    let cellX = margin;
    row.forEach((cell, colIndex) => {
      // Set colors based on row type
      if (rowIndex === 0) {
        // Header row
        doc.setFillColor(59, 130, 246); // Blue background
        doc.setDrawColor(59, 130, 246);
        doc.rect(cellX, tableY, colWidths[colIndex], cellHeight, "FD");
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255); // White text
      } else {
        // Data rows with alternating colors
        if (rowIndex % 2 === 0) {
          doc.setFillColor(249, 250, 251); // Light gray
        } else {
          doc.setFillColor(255, 255, 255); // White
        }
        doc.setDrawColor(229, 231, 235); // Gray border
        doc.rect(cellX, tableY, colWidths[colIndex], cellHeight, "FD");
        doc.setFont("helvetica", "normal");
        doc.setTextColor(55, 65, 81); // Dark gray
      }

      // Add text with proper alignment
      doc.setFontSize(10);
      if (colIndex === 0) {
        doc.text(cell, cellX + 3, tableY + 7); // Left align
      } else {
        doc.text(cell, cellX + colWidths[colIndex] / 2, tableY + 7, {
          align: "center",
        }); // Center align
      }

      cellX += colWidths[colIndex];
    });
    tableY += cellHeight;
  });

  yPosition = tableY + 15;

  // Key Metrics with card-like styling
  yPosition = checkNewPage(80);

  // Section header
  doc.setFillColor(168, 85, 247); // Purple background
  doc.rect(margin, yPosition, maxWidth, 15, "F");

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("🎯 Key Metrics", margin + 5, yPosition + 10);
  yPosition += 25;

  // Create metric cards
  const metrics = [
    {
      label: "Active Medications",
      value: progressData.activeMedications,
      icon: "💊",
    },
    {
      label: "Upcoming Appointments",
      value: progressData.upcomingAppointments,
      icon: "📅",
    },
    {
      label: "Overdue Appointments",
      value: progressData.overdueAppointments,
      icon: "⚠️",
    },
    { label: "Pending Tests", value: progressData.pendingTests, icon: "🧪" },
  ];

  const cardWidth = (maxWidth - 20) / 2; // Two cards per row
  const cardHeight = 25;
  let cardX = margin;
  let cardY = yPosition;

  metrics.forEach((metric, index) => {
    if (index % 2 === 0 && index > 0) {
      cardY += cardHeight + 10;
      cardX = margin;
    }

    // Draw card background
    doc.setFillColor(248, 250, 252); // Very light blue
    doc.setDrawColor(226, 232, 240); // Light gray border
    doc.rect(cardX, cardY, cardWidth, cardHeight, "FD");

    // Add metric content
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246); // Blue text
    doc.text(`${metric.icon} ${metric.label}`, cardX + 5, cardY + 10);

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42); // Very dark gray
    doc.text(metric.value.toString(), cardX + 5, cardY + 20);

    cardX += cardWidth + 10;
  });

  yPosition = cardY + cardHeight + 20;

  // Appointments Detail with enhanced styling
  if (progressData.appointments.length > 0) {
    yPosition = checkNewPage(50);

    // Section header
    doc.setFillColor(16, 185, 129); // Emerald background
    doc.rect(margin, yPosition, maxWidth, 15, "F");

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("🏥 Appointments", margin + 5, yPosition + 10);
    yPosition += 25;

    progressData.appointments.forEach((appointment) => {
      yPosition = checkNewPage(40);

      // Appointment card background
      const cardColor = appointment.isCompleted
        ? [220, 252, 231]
        : [254, 249, 195]; // Green or yellow
      doc.setFillColor(cardColor[0], cardColor[1], cardColor[2]);
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, yPosition, maxWidth, 30, "FD");

      // Status badge
      const statusColor = appointment.isCompleted
        ? [34, 197, 94]
        : [245, 158, 11]; // Green or orange
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.rect(margin + maxWidth - 60, yPosition + 3, 55, 12, "F");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(
        appointment.isCompleted ? "✓ COMPLETED" : "⏳ PENDING",
        margin + maxWidth - 57,
        yPosition + 10
      );

      yPosition += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55); // Dark gray
      doc.text(`${appointment.type}`, margin + 5, yPosition);

      yPosition += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      doc.text(
        `📅 ${new Date(appointment.scheduledDate).toLocaleDateString()}`,
        margin + 5,
        yPosition
      );

      if (appointment.description) {
        yPosition += 8;
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        yPosition = addWrappedText(
          appointment.description,
          margin + 5,
          yPosition,
          maxWidth - 70,
          9
        );
      }

      yPosition += 15;
    });
  }

  // Tests Detail with enhanced styling
  if (progressData.tests.length > 0) {
    yPosition = checkNewPage(50);

    // Section header
    doc.setFillColor(147, 51, 234); // Purple background
    doc.rect(margin, yPosition, maxWidth, 15, "F");

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("🧪 Tests & Diagnostics", margin + 5, yPosition + 10);
    yPosition += 25;

    progressData.tests.forEach((test) => {
      yPosition = checkNewPage(40);

      // Test card background
      const cardColor = test.isCompleted ? [220, 252, 231] : [254, 240, 138]; // Green or yellow
      doc.setFillColor(cardColor[0], cardColor[1], cardColor[2]);
      doc.setDrawColor(203, 213, 225);
      doc.rect(margin, yPosition, maxWidth, 30, "FD");

      // Status badge
      const statusColor = test.isCompleted ? [34, 197, 94] : [245, 158, 11]; // Green or orange
      doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
      doc.rect(margin + maxWidth - 60, yPosition + 3, 55, 12, "F");

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(255, 255, 255);
      doc.text(
        test.isCompleted ? "✓ COMPLETED" : "⏳ PENDING",
        margin + maxWidth - 57,
        yPosition + 10
      );

      yPosition += 8;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(31, 41, 55);
      doc.text(`${test.name}`, margin + 5, yPosition);

      yPosition += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(75, 85, 99);
      doc.text(
        `📅 ${new Date(test.scheduledDate).toLocaleDateString()}`,
        margin + 5,
        yPosition
      );

      if (test.description) {
        yPosition += 8;
        doc.setFontSize(9);
        doc.setTextColor(107, 114, 128);
        yPosition = addWrappedText(
          test.description,
          margin + 5,
          yPosition,
          maxWidth - 70,
          9
        );
      }

      yPosition += 15;
    });
  }

  // Recommendations with enhanced styling
  yPosition = checkNewPage(80);

  // Section header
  doc.setFillColor(239, 68, 68); // Red background
  doc.rect(margin, yPosition, maxWidth, 15, "F");

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("💡 Recommendations", margin + 5, yPosition + 10);
  yPosition += 25;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(55, 65, 81);

  const recommendations = [];

  if (progressData.overdueAppointments > 0) {
    recommendations.push({
      icon: "🚨",
      text: `Schedule ${progressData.overdueAppointments} overdue appointment(s) immediately`,
      priority: "high",
    });
  }

  if (progressData.pendingTests > 0) {
    recommendations.push({
      icon: "🧪",
      text: `Complete ${progressData.pendingTests} pending test(s)`,
      priority: "medium",
    });
  }

  if (progressData.medicationAdherence < 80) {
    recommendations.push({
      icon: "💊",
      text: "Improve medication adherence - consider setting up reminders",
      priority: "medium",
    });
  }

  if (
    progressData.upcomingAppointments === 0 &&
    progressData.totalAppointments > 0
  ) {
    recommendations.push({
      icon: "📅",
      text: "Schedule follow-up appointments as recommended",
      priority: "medium",
    });
  }

  if (recommendations.length === 0) {
    recommendations.push({
      icon: "✅",
      text: "Continue following your current treatment plan",
      priority: "low",
    });
    recommendations.push({
      icon: "🤝",
      text: "Maintain regular communication with your healthcare provider",
      priority: "low",
    });
  }

  recommendations.forEach((rec) => {
    yPosition = checkNewPage(20);

    // Priority color coding
    let bgColor, borderColor;
    switch (rec.priority) {
      case "high":
        bgColor = [254, 226, 226]; // Light red
        borderColor = [239, 68, 68]; // Red
        break;
      case "medium":
        bgColor = [255, 237, 213]; // Light orange
        borderColor = [245, 158, 11]; // Orange
        break;
      default:
        bgColor = [220, 252, 231]; // Light green
        borderColor = [34, 197, 94]; // Green
    }

    // Draw recommendation card
    doc.setFillColor(bgColor[0], bgColor[1], bgColor[2]);
    doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
    doc.rect(margin, yPosition - 3, maxWidth, 15, "FD");

    // Add recommendation text
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(31, 41, 55);
    yPosition = addWrappedText(
      `${rec.icon} ${rec.text}`,
      margin + 5,
      yPosition + 5,
      maxWidth - 10,
      11
    );
    yPosition += 8;
  });

  // Enhanced Footer with styling
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Footer background
    doc.setFillColor(248, 250, 252); // Very light blue
    doc.rect(0, pageHeight - 25, pageWidth, 25, "F");

    // Page number
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // Gray text
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth - margin - 20,
      pageHeight - 12
    );

    // Footer branding
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(59, 130, 246); // Blue text
    doc.text("Healthcare Buddy", margin, pageHeight - 12);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text("Progress Report", margin + 45, pageHeight - 12);
  }

  // Download the PDF
  const fileName = `progress-report-${patientInfo.name.replace(/\s+/g, "-")}-${
    new Date().toISOString().split("T")[0]
  }.pdf`;
  doc.save(fileName);
}

// Discharge Summary PDF Generation
interface DischargeSummaryData {
  id: string;
  fileName: string;
  diagnosis: string;
  medications: string;
  treatmentSummary: string;
  recoveryInstructions: string;
  followUpRequired?: string;
  restrictions?: string;
  createdAt: string;
  parsedAt: string;
  patient: {
    age: number;
    gender: string;
    user: {
      name: string;
    };
  };
}

export class DischargeSummaryPDF {
  private doc: jsPDF;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private currentY: number;
  private lineHeight: number;

  constructor() {
    this.doc = new jsPDF();
    this.pageWidth = this.doc.internal.pageSize.getWidth();
    this.pageHeight = this.doc.internal.pageSize.getHeight();
    this.margin = 20;
    this.currentY = this.margin;
    this.lineHeight = 7;
  }

  private addHeader(
    patientName: string,
    fileName: string,
    createdDate: string
  ) {
    // Healthcare Buddy Logo/Title
    this.doc.setFontSize(20);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(59, 130, 246); // Blue color
    this.doc.text("Healthcare Buddy", this.margin, this.currentY);

    this.currentY += 10;

    // Document Title
    this.doc.setFontSize(16);
    this.doc.setTextColor(0, 0, 0);
    this.doc.text("Discharge Summary Report", this.margin, this.currentY);

    this.currentY += 15;

    // Patient Information Box
    this.doc.setDrawColor(229, 231, 235); // Gray border
    this.doc.setFillColor(249, 250, 251); // Light gray background
    this.doc.rect(
      this.margin,
      this.currentY,
      this.pageWidth - this.margin * 2,
      30,
      "FD"
    );

    this.currentY += 8;
    this.doc.setFontSize(12);
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Patient:", this.margin + 5, this.currentY);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(patientName, this.margin + 30, this.currentY);

    this.currentY += 8;
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Document:", this.margin + 5, this.currentY);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(fileName, this.margin + 35, this.currentY);

    this.currentY += 8;
    this.doc.setFont("helvetica", "bold");
    this.doc.text("Date:", this.margin + 5, this.currentY);
    this.doc.setFont("helvetica", "normal");
    this.doc.text(createdDate, this.margin + 25, this.currentY);

    this.currentY += 20;
  }

  private addSection(title: string, content: string) {
    // Check if we need a new page
    if (this.currentY > this.pageHeight - 50) {
      this.addNewPage();
    }

    // Section Title with colored background
    this.doc.setFillColor(59, 130, 246); // Blue background
    this.doc.rect(
      this.margin,
      this.currentY - 3,
      this.pageWidth - this.margin * 2,
      12,
      "F"
    );

    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(255, 255, 255); // White text
    this.doc.text(title, this.margin + 3, this.currentY + 5);

    this.currentY += 15;

    // Content
    this.doc.setFontSize(11);
    this.doc.setFont("helvetica", "normal");
    this.doc.setTextColor(55, 65, 81); // Gray-700

    const lines = this.doc.splitTextToSize(
      content,
      this.pageWidth - this.margin * 2
    );

    for (const line of lines) {
      if (this.currentY > this.pageHeight - 30) {
        this.addNewPage();
      }
      this.doc.text(line, this.margin, this.currentY);
      this.currentY += this.lineHeight;
    }

    this.currentY += 12; // Space after section
  }

  private addMedicationsSection(medications: string) {
    // Check if we need a new page
    if (this.currentY > this.pageHeight - 80) {
      this.addNewPage();
    }

    // Section Title
    this.doc.setFillColor(34, 197, 94); // Green background for medications
    this.doc.rect(
      this.margin,
      this.currentY - 3,
      this.pageWidth - this.margin * 2,
      12,
      "F"
    );

    this.doc.setFontSize(14);
    this.doc.setFont("helvetica", "bold");
    this.doc.setTextColor(255, 255, 255);
    this.doc.text(
      "💊 Prescribed Medications",
      this.margin + 3,
      this.currentY + 5
    );

    this.currentY += 20;

    // Parse medications and create a structured display
    const medicationLines = medications
      .split("\n")
      .filter((line) => line.trim());

    if (medicationLines.length > 0) {
      medicationLines.forEach((medication) => {
        if (this.currentY > this.pageHeight - 30) {
          this.addNewPage();
        }

        // Add bullet point and medication
        this.doc.setFontSize(11);
        this.doc.setFont("helvetica", "bold");
        this.doc.setTextColor(34, 197, 94); // Green color
        this.doc.text("•", this.margin, this.currentY);

        this.doc.setFont("helvetica", "normal");
        this.doc.setTextColor(55, 65, 81);

        const medLines = this.doc.splitTextToSize(
          medication.trim(),
          this.pageWidth - this.margin * 2 - 10
        );
        for (const medLine of medLines) {
          this.doc.text(medLine, this.margin + 8, this.currentY);
          this.currentY += this.lineHeight;
        }

        this.currentY += 3; // Small space between medications
      });
    } else {
      // Single block of text
      this.doc.setFontSize(11);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(55, 65, 81);

      const lines = this.doc.splitTextToSize(
        medications,
        this.pageWidth - this.margin * 2
      );

      for (const line of lines) {
        if (this.currentY > this.pageHeight - 30) {
          this.addNewPage();
        }
        this.doc.text(line, this.margin, this.currentY);
        this.currentY += this.lineHeight;
      }
    }

    this.currentY += 12;
  }

  private addNewPage() {
    this.doc.addPage();
    this.currentY = this.margin;
  }

  private addFooter() {
    const totalPages = this.doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      this.doc.setPage(i);

      // Page number
      this.doc.setFontSize(10);
      this.doc.setFont("helvetica", "normal");
      this.doc.setTextColor(107, 114, 128);
      this.doc.text(
        `Page ${i} of ${totalPages}`,
        this.pageWidth - this.margin - 20,
        this.pageHeight - 10
      );

      // Footer text (only on last page)
      if (i === totalPages) {
        const footerText = `Generated by Healthcare Buddy`;
        const textWidth = this.doc.getTextWidth(footerText);

        this.doc.text(
          footerText,
          (this.pageWidth - textWidth) / 2,
          this.pageHeight - 20
        );
      }
    }
  }

  public generatePDF(summaryData: DischargeSummaryData): Blob {
    // Add header
    this.addHeader(
      summaryData.patient.user.name,
      summaryData.fileName,
      new Date(summaryData.createdAt).toLocaleDateString()
    );

    // Add sections
    this.addSection("🏥 Primary Diagnosis", summaryData.diagnosis);

    // Add medications with special formatting
    this.addMedicationsSection(summaryData.medications);

    this.addSection("📋 Treatment Summary", summaryData.treatmentSummary);
    this.addSection(
      "🏠 Recovery Instructions",
      summaryData.recoveryInstructions
    );

    if (
      summaryData.followUpRequired &&
      summaryData.followUpRequired !== "Not specified"
    ) {
      this.addSection(
        "📅 Follow-up Requirements",
        summaryData.followUpRequired
      );
    }

    if (
      summaryData.restrictions &&
      summaryData.restrictions !== "Not specified"
    ) {
      this.addSection("⚠️ Activity Restrictions", summaryData.restrictions);
    }

    // Add patient information section
    this.currentY += 20;
    this.addSection(
      "👤 Patient Information",
      `Name: ${summaryData.patient.user.name}\n` +
        `Age: ${summaryData.patient.age} years\n` +
        `Gender: ${summaryData.patient.gender}\n` +
        `Document Created: ${new Date(
          summaryData.createdAt
        ).toLocaleDateString()}\n` +
        `Document Processed: ${new Date(
          summaryData.parsedAt
        ).toLocaleDateString()}`
    );

    // Add footer to all pages
    this.addFooter();

    return this.doc.output("blob");
  }
}

// Utility function to generate and download discharge summary PDF
export function generateDischargeSummaryPDF(
  summaryData: DischargeSummaryData
): void {
  const pdfGenerator = new DischargeSummaryPDF();
  const pdfBlob = pdfGenerator.generatePDF(summaryData);

  // Create download link
  const url = window.URL.createObjectURL(pdfBlob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = `discharge-summary-${summaryData.fileName.replace(
    /\.[^/.]+$/,
    ""
  )}-${new Date().toISOString().split("T")[0]}.pdf`;

  document.body.appendChild(a);
  a.click();

  // Cleanup
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
