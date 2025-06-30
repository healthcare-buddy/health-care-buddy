"use client";

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
import {
  Calendar,
  FileText,
  Stethoscope,
  TestTube,
  Syringe,
  CheckCircle,
  AlertCircle,
  Plus,
  Loader2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import type { Patient } from "@/types";
import Link from "next/link";
import { FollowUpPlanSkeleton } from "@/components/LoadingSkeleton";

interface FollowUpPlanContentProps {
  userId: string;
}

interface DischargeSummary {
  id: string;
  fileName: string;
  diagnosis: string;
  createdAt: string;
  hasFollowUpPlan: boolean;
}

export function FollowUpPlanContent({ userId }: FollowUpPlanContentProps) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [dischargeSummaries, setDischargeSummaries] = useState<
    DischargeSummary[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingPlanId, setGeneratingPlanId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      // Fetch patient data with follow-up plans
      const patientResponse = await fetch(`/api/patient/${userId}`);
      if (patientResponse.ok) {
        const patientData = await patientResponse.json();
        setPatient(patientData);
      }

      // Fetch discharge summaries with follow-up plan status
      const summariesResponse = await fetch(
        `/api/discharge-summary/with-plans/${userId}`
      );
      if (summariesResponse.ok) {
        const summariesData = await summariesResponse.json();
        setDischargeSummaries(summariesData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load data");
    } finally {
      setIsLoading(false);
    }
  };

  const generateFollowUpPlan = async (dischargeSummaryId: string) => {
    if (!patient) {
      toast.error("Patient data not found");
      return;
    }

    setGeneratingPlanId(dischargeSummaryId);
    try {
      const response = await fetch("/api/ai/generate-followup-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dischargeSummaryId,
          patientAge: patient.age,
          patientGender: patient.gender,
        }),
      });

      if (response.ok) {
        const { followUpPlan } = await response.json();

        // Save the generated plan
        const saveResponse = await fetch("/api/follow-up-plan/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dischargeSummaryId,
            followUpPlan,
          }),
        });

        if (saveResponse.ok) {
          toast.success("Follow-up plan generated successfully!");
          fetchData(); // Refresh data
        } else {
          toast.error("Failed to save follow-up plan");
        }
      } else {
        toast.error("Failed to generate follow-up plan");
      }
    } catch (error) {
      console.error("Error generating follow-up plan:", error);
      toast.error("Something went wrong");
    } finally {
      setGeneratingPlanId(null);
    }
  };

  if (isLoading) {
    return <FollowUpPlanSkeleton />;
  }

  if (!patient) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Patient Profile</h3>
        <p className="text-muted-foreground mb-4">
          Please complete your profile to view follow-up plans.
        </p>
        <Button asChild>
          <Link href="/profile">Complete Profile</Link>
        </Button>
      </div>
    );
  }

  if (dischargeSummaries.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Discharge Summaries</h3>
        <p className="text-muted-foreground mb-4">
          Upload your discharge summary to generate a personalized follow-up
          plan.
        </p>
        <Button asChild>
          <Link href="/discharge-summary">Upload Discharge Summary</Link>
        </Button>
      </div>
    );
  }

  const latestPlan = patient.followUpPlans?.[0];

  return (
    <div className="space-y-6">
      {/* Discharge Summaries List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Your Discharge Summaries ({dischargeSummaries.length})
          </CardTitle>
          <CardDescription>
            Generate follow-up plans for your discharge summaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dischargeSummaries.map((summary) => (
              <div
                key={summary.id}
                className="flex max-sm:flex-col max-sm:space-y-3 items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-3 flex-1 text-wrap">
                  <FileText className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm">{summary.fileName}</p>
                    <p className="text-xs text-muted-foreground truncate text-wrap">
                      {summary.diagnosis.substring(0, 80)}...
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Uploaded:{" "}
                      {new Date(summary.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                  {summary.hasFollowUpPlan ? (
                    <>
                      <Badge variant="default" className="flex items-center">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Plan Created
                      </Badge>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/follow-up-plan/${summary.id}`}>
                          <Eye className="mr-1 h-3 w-3" />
                          View Plan
                        </Link>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Badge variant="secondary">No Plan</Badge>
                      <Button
                        size="sm"
                        onClick={() => generateFollowUpPlan(summary.id)}
                        disabled={generatingPlanId === summary.id}
                      >
                        {generatingPlanId === summary.id ? (
                          <>
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <Plus className="mr-1 h-3 w-3" />
                            Generate Plan
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Latest Follow-up Plan Preview */}
      {latestPlan && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Latest Follow-up Plan
                </span>
                <Badge
                  variant={latestPlan.isConfirmed ? "default" : "secondary"}
                >
                  {latestPlan.isConfirmed ? "Confirmed" : "Draft"}
                </Badge>
              </CardTitle>
              <CardDescription>
                Generated on{" "}
                {new Date(latestPlan.createdAt).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!latestPlan.isConfirmed && (
                <div className="flex items-center space-x-2 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg mb-4">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This plan is in draft mode. Please review and confirm to
                    activate reminders.
                  </p>
                  <Button size="sm" className="ml-auto">
                    Confirm Plan
                  </Button>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Stethoscope className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {latestPlan.appointments?.length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Appointments</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <TestTube className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {latestPlan.tests?.length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Tests</p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <Syringe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold">
                    {latestPlan.vaccines?.length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Vaccines</p>
                </div>
              </div>

              <div className="mt-4">
                <Button asChild className="w-full">
                  <Link
                    href={`/follow-up-plan/${latestPlan.dischargeSummaryId}`}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Complete Plan
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            <Button variant="outline" asChild>
              <Link href="/discharge-summary">
                <FileText className="mr-2 h-4 w-4" />
                Upload New Summary
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/medications">
                <Plus className="mr-2 h-4 w-4" />
                View Medications
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/progress">
                <Calendar className="mr-2 h-4 w-4" />
                Progress Report
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
