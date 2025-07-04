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
  Clock,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { FollowUpPlanSkeleton } from "../LoadingSkeleton";

interface ViewFollowUpPlanContentProps {
  summaryId: string;
}

interface FollowUpPlan {
  id: string;
  isConfirmed: boolean;
  createdAt: string;
  dischargeSummary: {
    id: string;
    fileName: string;
    diagnosis: string;
  };
  appointments: Array<{
    id: string;
    type: string;
    description: string;
    scheduledDate: string;
    isCompleted: boolean;
    notes?: string;
  }>;
  tests: Array<{
    id: string;
    name: string;
    description: string;
    scheduledDate: string;
    isCompleted: boolean;
    results?: string;
  }>;
  vaccines: Array<{
    id: string;
    name: string;
    description: string;
    scheduledDate: string;
    isCompleted: boolean;
    administeredAt?: string;
  }>;
}

export function ViewFollowUpPlanContent({
  summaryId,
}: ViewFollowUpPlanContentProps) {
  const [followUpPlan, setFollowUpPlan] = useState<FollowUpPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFollowUpPlan();
  }, [summaryId]);

  const fetchFollowUpPlan = async () => {
    try {
      const response = await fetch(
        `/api/follow-up-plan/by-summary/${summaryId}`
      );
      if (response.ok) {
        const data = await response.json();
        setFollowUpPlan(data);
      } else {
        toast.error("Follow-up plan not found");
      }
    } catch (error) {
      console.error("Error fetching follow-up plan:", error);
      toast.error("Failed to load follow-up plan");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <FollowUpPlanSkeleton />;
  }

  if (!followUpPlan) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Follow-up Plan Found</h3>
        <p className="text-muted-foreground mb-4">
          No follow-up plan exists for this discharge summary yet.
        </p>
        <Button asChild>
          <Link href="/follow-up-plan">Back to Follow-up Plans</Link>
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
            <Link href="/follow-up-plan">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Follow-up Plan</h1>
            <p className="text-muted-foreground">
              {followUpPlan.dischargeSummary.fileName}
            </p>
          </div>
        </div>
      </div>

      {/* Plan Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Plan Overview
          </CardTitle>
          <CardDescription>
            Generated on {new Date(followUpPlan.createdAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Stethoscope className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {followUpPlan.appointments.length}
              </p>
              <p className="text-sm text-muted-foreground">Appointments</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <TestTube className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">{followUpPlan.tests.length}</p>
              <p className="text-sm text-muted-foreground">Tests</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Syringe className="h-8 w-8 text-primary mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {followUpPlan.vaccines.length}
              </p>
              <p className="text-sm text-muted-foreground">Vaccines</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments */}
      {followUpPlan.appointments && followUpPlan.appointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Stethoscope className="mr-2 h-5 w-5" />
              Appointments ({followUpPlan.appointments.length})
            </CardTitle>
            <CardDescription>
              Scheduled follow-up appointments with healthcare providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {followUpPlan.appointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-start space-x-3 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {appointment.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">
                        {appointment.type}
                      </h4>
                      <Badge
                        variant={
                          appointment.isCompleted ? "default" : "outline"
                        }
                      >
                        {new Date(
                          appointment.scheduledDate
                        ).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {appointment.description}
                    </p>
                    {appointment.notes && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Notes: {appointment.notes}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tests */}
      {followUpPlan.tests && followUpPlan.tests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TestTube className="mr-2 h-5 w-5" />
              Tests & Diagnostics ({followUpPlan.tests.length})
            </CardTitle>
            <CardDescription>
              Required diagnostic tests and lab work
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {followUpPlan.tests.map((test) => (
                <div
                  key={test.id}
                  className="flex items-start space-x-3 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {test.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{test.name}</h4>
                      <Badge variant={test.isCompleted ? "default" : "outline"}>
                        {new Date(test.scheduledDate).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {test.description}
                    </p>
                    {test.results && (
                      <div className="mt-2 p-2 bg-green-50 dark:bg-green-950/20 rounded">
                        <p className="text-xs font-medium text-green-700 dark:text-green-300">
                          Results:
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          {test.results}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vaccines */}
      {followUpPlan.vaccines && followUpPlan.vaccines.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Syringe className="mr-2 h-5 w-5" />
              Vaccinations ({followUpPlan.vaccines.length})
            </CardTitle>
            <CardDescription>
              Recommended vaccinations and immunizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {followUpPlan.vaccines.map((vaccine) => (
                <div
                  key={vaccine.id}
                  className="flex items-start space-x-3 p-4 border rounded-lg"
                >
                  <div className="flex-shrink-0">
                    {vaccine.isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-sm">{vaccine.name}</h4>
                      <Badge
                        variant={vaccine.isCompleted ? "default" : "outline"}
                      >
                        {new Date(vaccine.scheduledDate).toLocaleDateString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {vaccine.description}
                    </p>
                    {vaccine.administeredAt && (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        Administered on{" "}
                        {new Date(vaccine.administeredAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Plan Actions</CardTitle>
          <CardDescription>
            Manage your follow-up plan and schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/progress">
                <CheckCircle className="mr-2 h-4 w-4" />
                View Progress
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
