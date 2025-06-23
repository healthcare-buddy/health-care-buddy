export interface User {
  id: string;
  email: string;
  name: string;
  role: "PATIENT" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}

export interface Patient {
  id: string;
  userId: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  language: "ENGLISH" | "HINDI" | "GUJARATI";
  createdAt: Date;
  updatedAt: Date;
  user: User;
  dischargeSummaries: DischargeSummary[];
  followUpPlans: FollowUpPlan[];
  medications: Medication[];
}

export interface DischargeSummary {
  id: string;
  patientId: string;
  fileName: string;
  fileUrl: string;
  diagnosis: string;
  medications: string;
  treatmentSummary: string;
  recoveryInstructions: string;
  parsedAt: Date;
  createdAt: Date;
  patient: Patient;
}

export interface FollowUpPlan {
  id: string;
  patientId: string;
  dischargeSummaryId: string;
  appointments: Appointment[];
  tests: Test[];
  vaccines: Vaccine[];
  isConfirmed: boolean;
  createdAt: Date;
  updatedAt: Date;
  patient: Patient;
  dischargeSummary: DischargeSummary;
}

export interface Appointment {
  id: string;
  followUpPlanId: string;
  type: string;
  description: string;
  scheduledDate: Date;
  isCompleted: boolean;
  notes?: string;
  createdAt: Date;
  followUpPlan: FollowUpPlan;
}

export interface Test {
  id: string;
  followUpPlanId: string;
  name: string;
  description: string;
  scheduledDate: Date;
  isCompleted: boolean;
  results?: string;
  createdAt: Date;
  followUpPlan: FollowUpPlan;
}

export interface Vaccine {
  id: string;
  followUpPlanId: string;
  name: string;
  description: string;
  scheduledDate: Date;
  isCompleted: boolean;
  administeredAt?: Date;
  createdAt: Date;
  followUpPlan: FollowUpPlan;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  sideEffects?: string;
  isActive: boolean;
  createdAt: Date;
  patient: Patient;
  reminders: MedicationReminder[];
}

export interface MedicationReminder {
  id: string;
  medicationId: string;
  time: string;
  isEnabled: boolean;
  lastSent?: Date;
  createdAt: Date;
  medication: Medication;
}

export interface ProgressReport {
  id: string;
  patientId: string;
  reportDate: Date;
  completedAppointments: number;
  missedAppointments: number;
  medicationAdherence: number;
  overallProgress: string;
  notes?: string;
  createdAt: Date;
  patient: Patient;
}

export interface PatientRegistrationForm {
  name: string;
  age: number;
  gender: "MALE" | "FEMALE" | "OTHER";
  phone: string;
  email: string;
  language: "ENGLISH" | "HINDI" | "GUJARATI";
  dischargeSummary: File | null;
}

export interface VoiceAssistantMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  language: "ENGLISH" | "HINDI" | "GUJARATI";
}
