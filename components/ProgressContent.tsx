// import { prisma } from "@/lib/prisma";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//   Calendar,
//   Pill,
//   TrendingUp,
//   CheckCircle,
//   Clock,
//   AlertTriangle,
//   Download,
//   Target,
//   Activity,
// } from "lucide-react";
// import Link from "next/link";

// interface ProgressContentProps {
//   userId: string;
// }

// export async function ProgressContent({ userId }: ProgressContentProps) {
//   const patient = await prisma.patient.findUnique({
//     where: { userId },
//     include: {
//       followUpPlans: {
//         include: {
//           appointments: true,
//           tests: true,
//           vaccines: true,
//         },
//         orderBy: { createdAt: "desc" },
//       },
//       medications: {
//         where: { isActive: true },
//       },
//       dischargeSummaries: {
//         orderBy: { createdAt: "desc" },
//         take: 1,
//       },
//     },
//   });

//   if (!patient) {
//     return (
//       <div className="text-center py-12">
//         <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//         <h3 className="text-lg font-semibold mb-2">No Patient Profile</h3>
//         <p className="text-muted-foreground mb-4">
//           Please complete your profile to view progress reports.
//         </p>
//         <Button asChild>
//           <Link href="/profile">Complete Profile</Link>
//         </Button>
//       </div>
//     );
//   }

//   // Calculate progress metrics
//   const allAppointments = patient.followUpPlans.flatMap(
//     (plan) => plan.appointments
//   );
//   const allTests = patient.followUpPlans.flatMap((plan) => plan.tests);
//   const allVaccines = patient.followUpPlans.flatMap((plan) => plan.vaccines);

//   const completedAppointments = allAppointments.filter(
//     (apt) => apt.isCompleted
//   ).length;
//   const totalAppointments = allAppointments.length;
//   const upcomingAppointments = allAppointments.filter(
//     (apt) => !apt.isCompleted && new Date(apt.scheduledDate) > new Date()
//   ).length;
//   const overdueAppointments = allAppointments.filter(
//     (apt) => !apt.isCompleted && new Date(apt.scheduledDate) < new Date()
//   ).length;

//   const completedTests = allTests.filter((test) => test.isCompleted).length;
//   const totalTests = allTests.length;
//   const pendingTests = allTests.filter((test) => !test.isCompleted).length;

//   const completedVaccines = allVaccines.filter(
//     (vaccine) => vaccine.isCompleted
//   ).length;
//   const totalVaccines = allVaccines.length;

//   const appointmentProgress =
//     totalAppointments > 0
//       ? (completedAppointments / totalAppointments) * 100
//       : 0;
//   const testProgress = totalTests > 0 ? (completedTests / totalTests) * 100 : 0;
//   const vaccineProgress =
//     totalVaccines > 0 ? (completedVaccines / totalVaccines) * 100 : 0;
//   const overallProgress =
//     (appointmentProgress + testProgress + vaccineProgress) / 3 || 0;

//   // Medication adherence (simplified calculation)
//   const activeMedications = patient.medications.length;
//   const medicationAdherence = activeMedications > 0 ? 85 : 0; // Placeholder calculation

//   return (
//     <div className="space-y-6">
//       {/* Overview Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Overall Progress
//             </CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {Math.round(overallProgress)}%
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Treatment completion
//             </p>
//             <Progress value={overallProgress} className="mt-2" />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Appointments</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {completedAppointments}/{totalAppointments}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Completed appointments
//             </p>
//             {overdueAppointments > 0 && (
//               <Badge variant="destructive" className="mt-1 text-xs">
//                 {overdueAppointments} overdue
//               </Badge>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Tests & Labs</CardTitle>
//             <Target className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {completedTests}/{totalTests}
//             </div>
//             <p className="text-xs text-muted-foreground">Completed tests</p>
//             {pendingTests > 0 && (
//               <Badge variant="secondary" className="mt-1 text-xs">
//                 {pendingTests} pending
//               </Badge>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Medication Adherence
//             </CardTitle>
//             <Pill className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{medicationAdherence}%</div>
//             <p className="text-xs text-muted-foreground">Adherence rate</p>
//             <Progress value={medicationAdherence} className="mt-2" />
//           </CardContent>
//         </Card>
//       </div>

//       {/* Detailed Progress */}
//       <div className="grid gap-6 md:grid-cols-2">
//         {/* Appointments Progress */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Calendar className="mr-2 h-5 w-5" />
//               Appointment Progress
//             </CardTitle>
//             <CardDescription>
//               Track your scheduled appointments and follow-ups
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Completion Rate</span>
//               <span className="text-sm text-muted-foreground">
//                 {Math.round(appointmentProgress)}%
//               </span>
//             </div>
//             <Progress value={appointmentProgress} />

//             <div className="space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center">
//                   <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                   <span>Completed</span>
//                 </div>
//                 <span className="font-medium">{completedAppointments}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center">
//                   <Clock className="h-4 w-4 text-blue-500 mr-2" />
//                   <span>Upcoming</span>
//                 </div>
//                 <span className="font-medium">{upcomingAppointments}</span>
//               </div>
//               {overdueAppointments > 0 && (
//                 <div className="flex items-center justify-between text-sm">
//                   <div className="flex items-center">
//                     <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
//                     <span>Overdue</span>
//                   </div>
//                   <span className="font-medium text-red-500">
//                     {overdueAppointments}
//                   </span>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Tests Progress */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center">
//               <Target className="mr-2 h-5 w-5" />
//               Tests & Diagnostics
//             </CardTitle>
//             <CardDescription>
//               Monitor your diagnostic tests and lab work
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center justify-between">
//               <span className="text-sm font-medium">Completion Rate</span>
//               <span className="text-sm text-muted-foreground">
//                 {Math.round(testProgress)}%
//               </span>
//             </div>
//             <Progress value={testProgress} />

//             <div className="space-y-2">
//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center">
//                   <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
//                   <span>Completed</span>
//                 </div>
//                 <span className="font-medium">{completedTests}</span>
//               </div>
//               <div className="flex items-center justify-between text-sm">
//                 <div className="flex items-center">
//                   <Clock className="h-4 w-4 text-orange-500 mr-2" />
//                   <span>Pending</span>
//                 </div>
//                 <span className="font-medium">{pendingTests}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Activity */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Recent Activity</CardTitle>
//           <CardDescription>
//             Your latest healthcare activities and milestones
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {/* Recent Appointments */}
//             {allAppointments
//               .filter((apt) => apt.isCompleted)
//               .sort(
//                 (a, b) =>
//                   new Date(b.scheduledDate).getTime() -
//                   new Date(a.scheduledDate).getTime()
//               )
//               .slice(0, 3)
//               .map((appointment) => (
//                 <div
//                   key={appointment.id}
//                   className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
//                 >
//                   <CheckCircle className="h-5 w-5 text-green-500" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">{appointment.type}</p>
//                     <p className="text-xs text-muted-foreground">
//                       Completed on{" "}
//                       {new Date(appointment.scheduledDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <Badge variant="secondary">Completed</Badge>
//                 </div>
//               ))}

//             {/* Recent Tests */}
//             {allTests
//               .filter((test) => test.isCompleted)
//               .sort(
//                 (a, b) =>
//                   new Date(b.scheduledDate).getTime() -
//                   new Date(a.scheduledDate).getTime()
//               )
//               .slice(0, 2)
//               .map((test) => (
//                 <div
//                   key={test.id}
//                   className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
//                 >
//                   <Target className="h-5 w-5 text-blue-500" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">{test.name}</p>
//                     <p className="text-xs text-muted-foreground">
//                       Completed on{" "}
//                       {new Date(test.scheduledDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <Badge variant="secondary">Results Available</Badge>
//                 </div>
//               ))}

//             {/* Show message if no recent activity */}
//             {completedAppointments === 0 && completedTests === 0 && (
//               <div className="text-center py-8 text-muted-foreground">
//                 <Activity className="h-8 w-8 mx-auto mb-2" />
//                 <p>No recent activity to display</p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Upcoming Tasks */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Upcoming Tasks</CardTitle>
//           <CardDescription>
//             Your scheduled appointments and pending tests
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {/* Upcoming Appointments */}
//             {allAppointments
//               .filter(
//                 (apt) =>
//                   !apt.isCompleted && new Date(apt.scheduledDate) > new Date()
//               )
//               .sort(
//                 (a, b) =>
//                   new Date(a.scheduledDate).getTime() -
//                   new Date(b.scheduledDate).getTime()
//               )
//               .slice(0, 3)
//               .map((appointment) => (
//                 <div
//                   key={appointment.id}
//                   className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg"
//                 >
//                   <Calendar className="h-5 w-5 text-blue-500" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">{appointment.type}</p>
//                     <p className="text-xs text-muted-foreground">
//                       Scheduled for{" "}
//                       {new Date(appointment.scheduledDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <Badge variant="outline">Upcoming</Badge>
//                 </div>
//               ))}

//             {/* Pending Tests */}
//             {allTests
//               .filter((test) => !test.isCompleted)
//               .sort(
//                 (a, b) =>
//                   new Date(a.scheduledDate).getTime() -
//                   new Date(b.scheduledDate).getTime()
//               )
//               .slice(0, 2)
//               .map((test) => (
//                 <div
//                   key={test.id}
//                   className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg"
//                 >
//                   <Target className="h-5 w-5 text-orange-500" />
//                   <div className="flex-1">
//                     <p className="text-sm font-medium">{test.name}</p>
//                     <p className="text-xs text-muted-foreground">
//                       Scheduled for{" "}
//                       {new Date(test.scheduledDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <Badge variant="outline">Pending</Badge>
//                 </div>
//               ))}

//             {/* Show message if no upcoming tasks */}
//             {upcomingAppointments === 0 && pendingTests === 0 && (
//               <div className="text-center py-8 text-muted-foreground">
//                 <Clock className="h-8 w-8 mx-auto mb-2" />
//                 <p>No upcoming tasks scheduled</p>
//               </div>
//             )}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Actions */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Progress Actions</CardTitle>
//           <CardDescription>
//             Download reports and manage your progress
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="flex flex-col sm:flex-row gap-4">
//             <Button className="flex-1">
//               <Download className="mr-2 h-4 w-4" />
//               Download Progress Report
//             </Button>
//             <Button variant="outline" className="flex-1" asChild>
//               <Link href="/follow-up-plan">
//                 <Calendar className="mr-2 h-4 w-4" />
//                 View Follow-up Plan
//               </Link>
//             </Button>
//             <Button variant="outline" className="flex-1" asChild>
//               <Link href="/medications">
//                 <Pill className="mr-2 h-4 w-4" />
//                 Manage Medications
//               </Link>
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Calendar,
//   Pill,
//   TrendingUp,
//   CheckCircle,
//   Clock,
//   AlertTriangle,
//   Download,
//   Target,
//   Activity,
// } from "lucide-react";
// import { toast } from "sonner";
// import Link from "next/link";
// import { ProgressSkeleton } from "./LoadingSkeleton";

// interface ProgressContentProps {
//   userId: string;
// }

// interface ProgressData {
//   totalAppointments: number;
//   completedAppointments: number;
//   upcomingAppointments: number;
//   overdueAppointments: number;
//   totalTests: number;
//   completedTests: number;
//   pendingTests: number;
//   totalVaccines: number;
//   completedVaccines: number;
//   activeMedications: number;
//   medicationAdherence: number;
//   appointments: Array<{
//     id: string;
//     type: string;
//     description: string;
//     scheduledDate: string;
//     isCompleted: boolean;
//     status?: "COMPLETED" | "UPCOMING" | "OVERDUE" | "SKIPPED";
//   }>;
//   tests: Array<{
//     id: string;
//     name: string;
//     description: string;
//     scheduledDate: string;
//     isCompleted: boolean;
//     status?: "COMPLETED" | "PENDING" | "SKIPPED";
//   }>;
// }

// export function ProgressContent({ userId }: ProgressContentProps) {
//   const [progressData, setProgressData] = useState<ProgressData | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isDownloading, setIsDownloading] = useState(false);

//   useEffect(() => {
//     fetchProgressData();
//   }, [userId]);

//   const fetchProgressData = async () => {
//     try {
//       const response = await fetch(`/api/progress/${userId}`);
//       if (response.ok) {
//         const data = await response.json();
//         setProgressData(data);
//       }
//     } catch (error) {
//       console.error("Error fetching progress data:", error);
//       toast.error("Failed to load progress data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const updateAppointmentStatus = async (
//     appointmentId: string,
//     status: "COMPLETED" | "SKIPPED"
//   ) => {
//     try {
//       const response = await fetch(
//         `/api/appointments/${appointmentId}/status`,
//         {
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ status }),
//         }
//       );

//       if (response.ok) {
//         toast.success(`Appointment marked as ${status.toLowerCase()}`);
//         fetchProgressData(); // Refresh data
//       } else {
//         toast.error("Failed to update appointment status");
//       }
//     } catch (error) {
//       console.error("Error updating appointment status:", error);
//       toast.error("Something went wrong");
//     }
//   };

//   const updateTestStatus = async (
//     testId: string,
//     status: "COMPLETED" | "SKIPPED"
//   ) => {
//     try {
//       const response = await fetch(`/api/tests/${testId}/status`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ status }),
//       });

//       if (response.ok) {
//         toast.success(`Test marked as ${status.toLowerCase()}`);
//         fetchProgressData(); // Refresh data
//       } else {
//         toast.error("Failed to update test status");
//       }
//     } catch (error) {
//       console.error("Error updating test status:", error);
//       toast.error("Something went wrong");
//     }
//   };

//   const downloadProgressReport = async () => {
//     setIsDownloading(true);
//     try {
//       const response = await fetch(`/api/progress/${userId}/download`, {
//         method: "POST",
//       });

//       if (response.ok) {
//         const blob = await response.blob();
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement("a");
//         a.style.display = "none";
//         a.href = url;
//         a.download = `progress-report-${
//           new Date().toISOString().split("T")[0]
//         }.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         window.URL.revokeObjectURL(url);
//         toast.success("Progress report downloaded successfully!");
//       } else {
//         toast.error("Failed to generate progress report");
//       }
//     } catch (error) {
//       console.error("Error downloading report:", error);
//       toast.error("Something went wrong");
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   if (isLoading) {
//     return <ProgressSkeleton />;
//   }

//   if (!progressData) {
//     return (
//       <div className="text-center py-12">
//         <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
//         <h3 className="text-lg font-semibold mb-2">No Progress Data</h3>
//         <p className="text-muted-foreground mb-4">
//           Complete your profile to view progress reports.
//         </p>
//         <Button asChild>
//           <Link href="/profile">Complete Profile</Link>
//         </Button>
//       </div>
//     );
//   }

//   const appointmentProgress =
//     progressData.totalAppointments > 0
//       ? (progressData.completedAppointments / progressData.totalAppointments) *
//         100
//       : 0;
//   const testProgress =
//     progressData.totalTests > 0
//       ? (progressData.completedTests / progressData.totalTests) * 100
//       : 0;
//   const vaccineProgress =
//     progressData.totalVaccines > 0
//       ? (progressData.completedVaccines / progressData.totalVaccines) * 100
//       : 0;
//   const overallProgress =
//     (appointmentProgress + testProgress + vaccineProgress) / 3 || 0;

//   return (
//     <div className="space-y-6">
//       {/* Overview Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Overall Progress
//             </CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {Math.round(overallProgress)}%
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Treatment completion
//             </p>
//             <Progress value={overallProgress} className="mt-2" />
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Appointments</CardTitle>
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {progressData.completedAppointments}/
//               {progressData.totalAppointments}
//             </div>
//             <p className="text-xs text-muted-foreground">
//               Completed appointments
//             </p>
//             {progressData.overdueAppointments > 0 && (
//               <Badge variant="destructive" className="mt-1 text-xs">
//                 {progressData.overdueAppointments} overdue
//               </Badge>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Tests & Labs</CardTitle>
//             <Target className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {progressData.completedTests}/{progressData.totalTests}
//             </div>
//             <p className="text-xs text-muted-foreground">Completed tests</p>
//             {progressData.pendingTests > 0 && (
//               <Badge variant="secondary" className="mt-1 text-xs">
//                 {progressData.pendingTests} pending
//               </Badge>
//             )}
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Medication Adherence
//             </CardTitle>
//             <Pill className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">
//               {progressData.medicationAdherence}%
//             </div>
//             <p className="text-xs text-muted-foreground">Adherence rate</p>
//             <Progress
//               value={progressData.medicationAdherence}
//               className="mt-2"
//             />
//           </CardContent>
//         </Card>
//       </div>

//       {/* Appointment Management */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Calendar className="mr-2 h-5 w-5" />
//             Appointment Management
//           </CardTitle>
//           <CardDescription>
//             Mark appointments as completed or skipped
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {progressData.appointments.map((appointment) => (
//               <div
//                 key={appointment.id}
//                 className="flex items-center justify-between p-4 border rounded-lg"
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="flex-shrink-0">
//                     {appointment.isCompleted ? (
//                       <CheckCircle className="h-5 w-5 text-green-500" />
//                     ) : new Date(appointment.scheduledDate) < new Date() ? (
//                       <AlertTriangle className="h-5 w-5 text-red-500" />
//                     ) : (
//                       <Clock className="h-5 w-5 text-orange-500" />
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-sm">{appointment.type}</h4>
//                     <p className="text-sm text-muted-foreground">
//                       {appointment.description}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {new Date(appointment.scheduledDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Badge
//                     variant={
//                       appointment.isCompleted
//                         ? "default"
//                         : new Date(appointment.scheduledDate) < new Date()
//                         ? "destructive"
//                         : "outline"
//                     }
//                   >
//                     {appointment.isCompleted
//                       ? "Completed"
//                       : new Date(appointment.scheduledDate) < new Date()
//                       ? "Overdue"
//                       : "Upcoming"}
//                   </Badge>
//                   {!appointment.isCompleted && (
//                     <Select
//                       onValueChange={(value) =>
//                         updateAppointmentStatus(
//                           appointment.id,
//                           value as "COMPLETED" | "SKIPPED"
//                         )
//                       }
//                     >
//                       <SelectTrigger className="w-[120px]">
//                         <SelectValue placeholder="Mark as..." />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="COMPLETED">Completed</SelectItem>
//                         <SelectItem value="SKIPPED">Skipped</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Test Management */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center">
//             <Target className="mr-2 h-5 w-5" />
//             Test Management
//           </CardTitle>
//           <CardDescription>
//             Track your diagnostic tests and lab work
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {progressData.tests.map((test) => (
//               <div
//                 key={test.id}
//                 className="flex items-center justify-between p-4 border rounded-lg"
//               >
//                 <div className="flex items-center space-x-3">
//                   <div className="flex-shrink-0">
//                     {test.isCompleted ? (
//                       <CheckCircle className="h-5 w-5 text-green-500" />
//                     ) : (
//                       <Clock className="h-5 w-5 text-orange-500" />
//                     )}
//                   </div>
//                   <div>
//                     <h4 className="font-medium text-sm">{test.name}</h4>
//                     <p className="text-sm text-muted-foreground">
//                       {test.description}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       {new Date(test.scheduledDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <Badge variant={test.isCompleted ? "default" : "outline"}>
//                     {test.isCompleted ? "Completed" : "Pending"}
//                   </Badge>
//                   {!test.isCompleted && (
//                     <Select
//                       onValueChange={(value) =>
//                         updateTestStatus(
//                           test.id,
//                           value as "COMPLETED" | "SKIPPED"
//                         )
//                       }
//                     >
//                       <SelectTrigger className="w-[120px]">
//                         <SelectValue placeholder="Mark as..." />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="COMPLETED">Completed</SelectItem>
//                         <SelectItem value="SKIPPED">Skipped</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* Download Report */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Progress Report</CardTitle>
//           <CardDescription>
//             Download a comprehensive PDF report of your progress
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Button
//             onClick={downloadProgressReport}
//             disabled={isDownloading}
//             className="w-full"
//           >
//             {isDownloading ? (
//               <>
//                 <Clock className="mr-2 h-4 w-4 animate-spin" />
//                 Generating Report...
//               </>
//             ) : (
//               <>
//                 <Download className="mr-2 h-4 w-4" />
//                 Download Progress Report
//               </>
//             )}
//           </Button>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

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
import { ProgressSkeleton } from "./LoadingSkeleton";

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

export function ProgressContent({ userId }: ProgressContentProps) {
  const [progressData, setProgressData] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    fetchProgressData();
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
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/progress/${userId}/download`, {
        method: "POST",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = `progress-report-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success("Progress report downloaded successfully!");
      } else {
        toast.error("Failed to generate progress report");
      }
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Something went wrong");
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
