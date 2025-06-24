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
  FileText,
  ArrowLeft,
  Download,
  Trash2,
  Calendar,
  Pill,
  Activity,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ViewDischargeSummarySkeleton } from "./LoadingSkeleton";

interface DischargeSummary {
  id: string;
  fileName: string;
  fileUrl: string;
  diagnosis: string;
  medications: string;
  treatmentSummary: string;
  recoveryInstructions: string;
  followUpRequired: string;
  restrictions: string;
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

interface ViewDischargeSummaryContentProps {
  summaryId: string;
}

export function ViewDischargeSummaryContent({
  summaryId,
}: ViewDischargeSummaryContentProps) {
  const [summary, setSummary] = useState<DischargeSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchSummary();
  }, [summaryId]);

  const fetchSummary = async () => {
    try {
      const response = await fetch(`/api/discharge-summary/view/${summaryId}`);
      if (response.ok) {
        const data = await response.json();
        setSummary(data);
      } else {
        toast.error("Failed to load discharge summary");
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error fetching summary:", error);
      toast.error("Something went wrong");
      router.push("/profile");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSummary = async () => {
    if (!confirm("Are you sure you want to delete this discharge summary?"))
      return;

    try {
      const response = await fetch(`/api/discharge-summary/${summaryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Summary deleted successfully");
        router.push("/profile");
      } else {
        toast.error("Failed to delete summary");
      }
    } catch (error) {
      console.error("Error deleting summary:", error);
      toast.error("Something went wrong");
    }
  };

  const generateFollowUpPlan = async () => {
    if (!summary) return;

    setIsGeneratingPlan(true);
    try {
      const response = await fetch("/api/ai/generate-followup-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dischargeSummaryId: summaryId,
          patientAge: summary.patient.age,
          patientGender: summary.patient.gender,
        }),
      });

      if (response.ok) {
        const { followUpPlan } = await response.json();

        // Save the generated plan
        const saveResponse = await fetch("/api/follow-up-plan/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            dischargeSummaryId: summaryId,
            followUpPlan,
          }),
        });

        if (saveResponse.ok) {
          toast.success("Follow-up plan generated successfully!");
          router.push("/follow-up-plan");
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
      setIsGeneratingPlan(false);
    }
  };

  const downloadPdf = async () => {
    if (!summary) return;

    setIsDownloadingPdf(true);
    try {
      const response = await fetch(`/api/discharge-summary/${summaryId}/pdf`, {
        method: "POST",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `discharge-summary-${summary.fileName}-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("PDF downloaded successfully!");
      } else {
        toast.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Something went wrong");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  if (isLoading) {
    return <ViewDischargeSummarySkeleton />;
  }

  if (!summary) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Summary Not Found</h3>
        <p className="text-muted-foreground mb-4">
          The requested discharge summary could not be found.
        </p>
        <Button asChild>
          <Link href="/profile">Back to Profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/profile">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Discharge Summary
            </h1>
            <p className="text-muted-foreground">{summary.fileName}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadPdf}
            disabled={isDownloadingPdf}
          >
            {isDownloadingPdf ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Download PDF
          </Button>
          <Button variant="destructive" size="sm" onClick={deleteSummary}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Summary Info */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Document Information
              </CardTitle>
              <CardDescription>
                Basic information about this discharge summary
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">Processed</Badge>
              <Badge variant="outline">
                Uploaded: {new Date(summary.createdAt).toLocaleDateString()}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">File Name</p>
              <p className="font-medium">{summary.fileName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patient</p>
              <p className="font-medium">{summary.patient.user.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Processed Date</p>
              <p className="font-medium">
                {new Date(summary.parsedAt).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Patient Details</p>
              <p className="font-medium">
                {summary.patient.age} years, {summary.patient.gender}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Diagnosis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="mr-2 h-5 w-5 text-red-500" />
              Primary Diagnosis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{summary.diagnosis}</p>
          </CardContent>
        </Card>

        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Pill className="mr-2 h-5 w-5 text-blue-500" />
              Prescribed Medications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{summary.medications}</p>
          </CardContent>
        </Card>
      </div>

      {/* Treatment Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-green-500" />
            Treatment Summary
          </CardTitle>
          <CardDescription>
            Summary of treatments provided during hospital stay
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{summary.treatmentSummary}</p>
        </CardContent>
      </Card>

      {/* Recovery Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
            Recovery Instructions
          </CardTitle>
          <CardDescription>
            Post-discharge care instructions and recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">
            {summary.recoveryInstructions}
          </p>
        </CardContent>
      </Card>

      {/* Follow-up Requirements */}
      {summary.followUpRequired &&
        summary.followUpRequired !== "Not specified" && (
          <Card>
            <CardHeader>
              <CardTitle>Follow-up Requirements</CardTitle>
              <CardDescription>
                Required follow-up appointments and tests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed">
                {summary.followUpRequired}
              </p>
            </CardContent>
          </Card>
        )}

      {/* Restrictions */}
      {summary.restrictions && summary.restrictions !== "Not specified" && (
        <Card>
          <CardHeader>
            <CardTitle>Activity Restrictions</CardTitle>
            <CardDescription>
              Limitations and precautions to follow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{summary.restrictions}</p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Generate your personalized follow-up plan based on this summary
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={generateFollowUpPlan}
              disabled={isGeneratingPlan}
              className="flex-1"
            >
              {isGeneratingPlan ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Generate Follow-up Plan
                </>
              )}
            </Button>
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/medications">
                <Pill className="mr-2 h-4 w-4" />
                View Medications
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
