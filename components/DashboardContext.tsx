import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Pill,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

interface DashboardContentProps {
  userId: string;
}

export async function DashboardContent({ userId }: DashboardContentProps) {
  const patient = await prisma.patient.findUnique({
    where: { userId },
    include: {
      dischargeSummaries: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      followUpPlans: {
        include: {
          appointments: true,
          tests: true,
          vaccines: true,
        },
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      medications: {
        where: { isActive: true },
        take: 5,
      },
    },
  });

  if (!patient) {
    return (
      <div className="text-center py-12">
        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Complete Your Profile</h3>
        <p className="text-muted-foreground mb-4">
          Please complete your patient registration to access your dashboard.
        </p>
        <Button asChild>
          <Link href="/profile">Complete Registration</Link>
        </Button>
      </div>
    );
  }

  const latestPlan = patient.followUpPlans[0];
  const totalAppointments = latestPlan?.appointments.length || 0;
  const completedAppointments =
    latestPlan?.appointments.filter((a) => a.isCompleted).length || 0;
  const upcomingAppointments =
    latestPlan?.appointments.filter(
      (a) => !a.isCompleted && new Date(a.scheduledDate) > new Date()
    ).length || 0;
  const activeMedications = patient.medications.length;

  const progressPercentage =
    totalAppointments > 0
      ? (completedAppointments / totalAppointments) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Appointments
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Next appointment soon
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Medications
            </CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeMedications}</div>
            <p className="text-xs text-muted-foreground">Daily medications</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(progressPercentage)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Treatment completion
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Tasks
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Out of {totalAppointments} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Discharge Summary</CardTitle>
            <CardDescription>
              Your latest medical summary and treatment plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            {patient.dischargeSummaries[0] ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Diagnosis:</span>
                  <Badge variant="outline">
                    {patient.dischargeSummaries[0].diagnosis.substring(0, 30)}
                    ...
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  Uploaded:{" "}
                  {new Date(
                    patient.dischargeSummaries[0].createdAt
                  ).toLocaleDateString()}
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/follow-up-plan">View Details</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No discharge summary uploaded
                </p>
                <Button variant="outline" size="sm" className="mt-2" asChild>
                  <Link href="/profile">Upload Summary</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{"Today's Medications"}</CardTitle>
            <CardDescription>
              Your medication schedule for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            {patient.medications.length > 0 ? (
              <div className="space-y-3">
                {patient.medications.slice(0, 3).map((medication) => (
                  <div
                    key={medication.id}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{medication.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {medication.dosage}
                      </p>
                    </div>
                    <Badge variant="secondary">{medication.frequency}</Badge>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link href="/medications">View All Medications</Link>
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <Pill className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No active medications
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Treatment Progress</CardTitle>
          <CardDescription>
            Your overall progress in the follow-up plan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="w-full" />
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                <span>{completedAppointments} Completed</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-orange-500 mr-2" />
                <span>{upcomingAppointments} Upcoming</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
            <Button variant="outline" asChild>
              <Link href="/ai-assistant">
                <MessageSquare className="mr-2 h-4 w-4" />
                AI Assistant
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/medications">
                <Pill className="mr-2 h-4 w-4" />
                Medications
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/follow-up-plan">
                <Calendar className="mr-2 h-4 w-4" />
                Follow-up Plan
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/progress">
                <TrendingUp className="mr-2 h-4 w-4" />
                Progress Report
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
