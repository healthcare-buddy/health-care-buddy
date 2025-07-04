"use client";

import axios from "axios";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Pill,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertTriangle,
  Download,
  Target,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { ProgressSkeleton } from "../LoadingSkeleton";
import { generateProgressReportPDF } from "@/lib/pdf-generator";

interface ProgressContentProps {
  userId: string;
}

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
    status?: "COMPLETED" | "UPCOMING" | "OVERDUE" | "SKIPPED";
  }>;
  tests: Array<{
    id: string;
    name: string;
    description: string;
    scheduledDate: string;
    isCompleted: boolean;
    status?: "COMPLETED" | "PENDING" | "SKIPPED";
  }>;
}

interface PatientInfo {
  name: string;
  age: number;
  gender: string;
  email: string;
}

export function ProgressContent({ userId }: ProgressContentProps) {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchProgressData();
    fetchPatientInfo();
  }, [userId]);

  const fetchProgressData = async () => {
    try {
      const response = await fetch(`/api/progress/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProgressData(data);
      }
    } catch (error) {
      console.error("Error fetching progress data:", error);
      toast.error("Failed to load progress data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPatientInfo = async () => {
    try {
      const response = await axios.get(`/api/patient/${userId}`);
      if (response.data) {
        setPatientInfo({
          name: response.data.user.name,
          age: response.data.age,
          gender: response.data.gender,
          email: response.data.user.email,
        });
      }
    } catch (error) {
      console.error("Error fetching patient info:", error);
    }
  };

  const updateAppointmentStatus = async (
    appointmentId: string,
    status: "COMPLETED" | "SKIPPED"
  ) => {
    try {
      const response = await fetch(
        `/api/appointments/${appointmentId}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        }
      );

      if (response.ok) {
        toast.success(`Appointment marked as ${status.toLowerCase()}`);
        fetchProgressData(); // Refresh data
      } else {
        toast.error("Failed to update appointment status");
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      toast.error("Something went wrong");
    }
  };

  const updateTestStatus = async (
    testId: string,
    status: "COMPLETED" | "SKIPPED"
  ) => {
    try {
      const response = await fetch(`/api/tests/${testId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast.success(`Test marked as ${status.toLowerCase()}`);
        fetchProgressData(); // Refresh data
      } else {
        toast.error("Failed to update test status");
      }
    } catch (error) {
      console.error("Error updating test status:", error);
      toast.error("Something went wrong");
    }
  };

  const downloadProgressReport = async () => {
    if (!progressData || !patientInfo) {
      toast.error("Progress data not available");
      return;
    }

    setIsDownloading(true);
    try {
      generateProgressReportPDF(progressData, patientInfo);
      toast.success("Progress report downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Failed to generate progress report");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return <ProgressSkeleton />;
  }

  if (!progressData) {
    return (
      <div className="text-center py-8 md:py-12">
        <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Progress Data</h3>
        <p className="text-muted-foreground mb-4 px-4">
          Complete your profile to view progress reports.
        </p>
        <Button asChild>
          <Link href="/profile">Complete Profile</Link>
        </Button>
      </div>
    );
  }

  const appointmentProgress =
    progressData.totalAppointments > 0
      ? (progressData.completedAppointments / progressData.totalAppointments) *
        100
      : 0;
  const testProgress =
    progressData.totalTests > 0
      ? (progressData.completedTests / progressData.totalTests) * 100
      : 0;
  const vaccineProgress =
    progressData.totalVaccines > 0
      ? (progressData.completedVaccines / progressData.totalVaccines) * 100
      : 0;
  const overallProgress =
    (appointmentProgress + testProgress + vaccineProgress) / 3 || 0;

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Overall Progress
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {Math.round(overallProgress)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Treatment completion
            </p>
            <Progress value={overallProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {progressData.completedAppointments}/
              {progressData.totalAppointments}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
            {progressData.overdueAppointments > 0 && (
              <Badge variant="destructive" className="mt-1 text-xs">
                {progressData.overdueAppointments} overdue
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Tests & Labs
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {progressData.completedTests}/{progressData.totalTests}
            </div>
            <p className="text-xs text-muted-foreground">Completed</p>
            {progressData.pendingTests > 0 && (
              <Badge variant="secondary" className="mt-1 text-xs">
                {progressData.pendingTests} pending
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Medication
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {progressData.medicationAdherence}%
            </div>
            <p className="text-xs text-muted-foreground">Adherence rate</p>
            <Progress
              value={progressData.medicationAdherence}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Appointment Management */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Calendar className="mr-2 h-5 w-5" />
            Appointment Management
          </CardTitle>
          <CardDescription>
            Mark appointments as completed or skipped
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressData.appointments.length > 0 ? (
              progressData.appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      {appointment.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : new Date(appointment.scheduledDate) < new Date() ? (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm">
                        {appointment.type}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {appointment.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(
                          appointment.scheduledDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Badge
                      variant={
                        appointment.isCompleted
                          ? "default"
                          : new Date(appointment.scheduledDate) < new Date()
                          ? "destructive"
                          : "outline"
                      }
                      className="w-fit"
                    >
                      {appointment.isCompleted
                        ? "Completed"
                        : new Date(appointment.scheduledDate) < new Date()
                        ? "Overdue"
                        : "Upcoming"}
                    </Badge>
                    {!appointment.isCompleted && (
                      <Select
                        onValueChange={(value) =>
                          updateAppointmentStatus(
                            appointment.id,
                            value as "COMPLETED" | "SKIPPED"
                          )
                        }
                      >
                        <SelectTrigger className="w-full sm:w-[120px]">
                          <SelectValue placeholder="Mark as..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="SKIPPED">Skipped</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-8 w-8 mx-auto mb-2" />
                <p>No appointments scheduled</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Test Management */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Target className="mr-2 h-5 w-5" />
            Test Management
          </CardTitle>
          <CardDescription>
            Track your diagnostic tests and lab work
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {progressData.tests.length > 0 ? (
              progressData.tests.map((test) => (
                <div
                  key={test.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <div className="flex-shrink-0">
                      {test.isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-orange-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-medium text-sm">{test.name}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {test.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(test.scheduledDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Badge
                      variant={test.isCompleted ? "default" : "outline"}
                      className="w-fit"
                    >
                      {test.isCompleted ? "Completed" : "Pending"}
                    </Badge>
                    {!test.isCompleted && (
                      <Select
                        onValueChange={(value) =>
                          updateTestStatus(
                            test.id,
                            value as "COMPLETED" | "SKIPPED"
                          )
                        }
                      >
                        <SelectTrigger className="w-full sm:w-[120px]">
                          <SelectValue placeholder="Mark as..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                          <SelectItem value="SKIPPED">Skipped</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-8 w-8 mx-auto mb-2" />
                <p>No tests scheduled</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Download Report */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Progress Report</CardTitle>
          <CardDescription>
            Download a comprehensive PDF report of your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={downloadProgressReport}
            disabled={isDownloading}
            className="w-full"
          >
            {isDownloading ? (
              <>
                <Clock className="mr-2 h-4 w-4 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download Progress Report
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
