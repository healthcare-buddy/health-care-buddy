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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Users,
  FileText,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export async function AdminContent() {
  // Fetch admin dashboard data
  const [
    totalPatients,
    totalDischargeSummaries,
    totalFollowUpPlans,
    recentPatients,
    pendingPlans,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.dischargeSummary.count(),
    prisma.followUpPlan.count(),
    prisma.patient.findMany({
      include: {
        user: true,
        dischargeSummaries: true,
        followUpPlans: {
          include: {
            appointments: true,
            tests: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
    prisma.followUpPlan.findMany({
      where: { isConfirmed: false },
      include: {
        patient: {
          include: { user: true },
        },
        appointments: true,
        tests: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const completedAppointments = await prisma.appointment.count({
    where: { isCompleted: true },
  });

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPatients}</div>
            <p className="text-xs text-muted-foreground">Registered patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Discharge Summaries
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDischargeSummaries}</div>
            <p className="text-xs text-muted-foreground">Documents processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Follow-up Plans
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFollowUpPlans}</div>
            <p className="text-xs text-muted-foreground">Active plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Tasks
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedAppointments}</div>
            <p className="text-xs text-muted-foreground">
              Appointments completed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-orange-500" />
            Pending Plan Approvals ({pendingPlans.length})
          </CardTitle>
          <CardDescription>
            Follow-up plans awaiting medical review and approval
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingPlans.length > 0 ? (
            <div className="space-y-4">
              {pendingPlans.map((plan) => (
                <div
                  key={plan.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {plan.patient.user.name?.charAt(0) || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {plan.patient.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {plan.patient.user.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {plan.appointments.length} appointments
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {plan.tests.length} tests
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3 w-3" />
                      Review
                    </Button>
                    <Button size="sm">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No pending plans to review</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Patients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Recent Patients ({recentPatients.length})
          </CardTitle>
          <CardDescription>
            Recently registered patients and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPatients.map((patient) => {
              const hasDischargeSum = patient.dischargeSummaries.length > 0;
              const hasFollowUpPlan = patient.followUpPlans.length > 0;
              const totalAppointments = patient.followUpPlans.reduce(
                (acc, plan) => acc + plan.appointments.length,
                0
              );
              const completedAppointments = patient.followUpPlans.reduce(
                (acc, plan) =>
                  acc +
                  plan.appointments.filter((apt) => apt.isCompleted).length,
                0
              );

              return (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>
                        {patient.user.name?.charAt(0) || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{patient.user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {patient.user.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge
                          variant={hasDischargeSum ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {hasDischargeSum ? "Has Summary" : "No Summary"}
                        </Badge>
                        <Badge
                          variant={hasFollowUpPlan ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {hasFollowUpPlan ? "Has Plan" : "No Plan"}
                        </Badge>
                        {totalAppointments > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {completedAppointments}/{totalAppointments}{" "}
                            completed
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-1 h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="mr-1 h-3 w-3" />
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
