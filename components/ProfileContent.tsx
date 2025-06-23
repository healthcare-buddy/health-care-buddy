// "use client";

// import type React from "react";

// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Phone, FileText, Loader2 } from "lucide-react";
// import { toast } from "sonner";
// import type { Patient } from "@/types";
// import { Skeleton } from "./ui/skeleton";

// const formSchema = z.object({
//   age: z.number().min(1).max(120),
//   gender: z.enum(["MALE", "FEMALE", "OTHER"]),
//   phone: z.string().min(10, "Phone number must be at least 10 digits"),
//   language: z.enum(["ENGLISH", "HINDI", "GUJARATI"]),
// });

// interface ProfileContentProps {
//   userId: string;
// }

// export function ProfileContent({ userId }: ProfileContentProps) {
//   const [patient, setPatient] = useState<Patient | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       age: 0,
//       gender: "MALE",
//       phone: "",
//       language: "ENGLISH",
//     },
//   });

//   useEffect(() => {
//     fetchPatientData();
//   }, [userId]);

//   const fetchPatientData = async () => {
//     try {
//       const response = await fetch(`/api/patient/${userId}`);
//       if (response.ok) {
//         const data = await response.json();
//         setPatient(data);
//         if (data) {
//           form.reset({
//             age: data.age,
//             gender: data.gender,
//             phone: data.phone,
//             language: data.language,
//           });
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching patient data:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     setIsSubmitting(true);
//     try {
//       const formData = new FormData();
//       formData.append("age", values.age.toString());
//       formData.append("gender", values.gender);
//       formData.append("phone", values.phone);
//       formData.append("language", values.language);

//       if (selectedFile) {
//         formData.append("dischargeSummary", selectedFile);
//       }

//       const response = await fetch("/api/patient/update", {
//         method: "POST",
//         body: formData,
//       });

//       if (response.ok) {
//         toast.success("Profile updated successfully");
//         fetchPatientData();
//         setSelectedFile(null);
//       } else {
//         toast.error("Failed to update profile");
//       }
//     } catch (error) {
//       console.error("Error updating profile:", error);
//       toast.error("Something went wrong");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       if (file.type === "application/pdf" || file.type.startsWith("image/")) {
//         setSelectedFile(file);
//         toast.success("File selected successfully");
//       } else {
//         toast.error("Please select a PDF or image file");
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <Skeleton className="h-40 w-full flex items-center justify-center">
//         Loading...
//       </Skeleton>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Personal Information</CardTitle>
//           <CardDescription>
//             Update your personal details and medical information
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Form {...form}>
//             <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <FormField
//                   control={form.control}
//                   name="age"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Age</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           placeholder="Enter your age"
//                           {...field}
//                           onChange={(e) =>
//                             field.onChange(Number.parseInt(e.target.value))
//                           }
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="gender"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Gender</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select gender" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="MALE">Male</SelectItem>
//                           <SelectItem value="FEMALE">Female</SelectItem>
//                           <SelectItem value="OTHER">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="phone"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Phone Number</FormLabel>
//                       <FormControl>
//                         <div className="relative">
//                           <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//                           <Input
//                             placeholder="Enter phone number"
//                             className="pl-10"
//                             {...field}
//                           />
//                         </div>
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 <FormField
//                   control={form.control}
//                   name="language"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Preferred Language</FormLabel>
//                       <Select
//                         onValueChange={field.onChange}
//                         defaultValue={field.value}
//                       >
//                         <FormControl>
//                           <SelectTrigger className="w-full">
//                             <SelectValue placeholder="Select language" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           <SelectItem value="ENGLISH">English</SelectItem>
//                           <SelectItem value="HINDI">Hindi</SelectItem>
//                           <SelectItem value="GUJARATI">Gujarati</SelectItem>
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>

//               <div className="space-y-4">
//                 <div>
//                   <label className="text-sm font-medium">
//                     Discharge Summary
//                   </label>
//                   <div className="mt-2 flex items-center gap-4">
//                     <Input
//                       type="file"
//                       accept=".pdf,image/*"
//                       onChange={handleFileChange}
//                       className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
//                     />
//                     {selectedFile && (
//                       <div className="flex items-center text-sm text-muted-foreground">
//                         <FileText className="h-4 w-4 mr-2" />
//                         {selectedFile.name}
//                       </div>
//                     )}
//                   </div>
//                   <p className="text-xs text-muted-foreground mt-1">
//                     Upload your discharge summary (PDF or image format)
//                   </p>
//                 </div>
//               </div>

//               <Button type="submit" className="w-full" disabled={isSubmitting}>
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="animate-spin" />
//                     <span className="animate-pulse">Updating...</span>
//                   </>
//                 ) : (
//                   "Update Profile"
//                 )}
//               </Button>
//             </form>
//           </Form>
//         </CardContent>
//       </Card>

//       {patient?.dischargeSummaries && patient.dischargeSummaries.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Uploaded Documents</CardTitle>
//             <CardDescription>
//               Your previously uploaded discharge summaries
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-2">
//               {patient.dischargeSummaries.map((summary) => (
//                 <div
//                   key={summary.id}
//                   className="flex items-center justify-between p-3 border rounded-lg"
//                 >
//                   <div className="flex items-center">
//                     <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
//                     <div>
//                       <p className="text-sm font-medium">{summary.fileName}</p>
//                       <p className="text-xs text-muted-foreground">
//                         Uploaded:{" "}
//                         {new Date(summary.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
//                   <Button variant="outline" size="sm">
//                     View Details
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       )}
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Plus, Eye, Trash2, Phone, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileSkeleton } from "./LoadingSkeleton";

interface DischargeSummary {
  id: string;
  fileName: string;
  diagnosis: string;
  medications: string;
  treatmentSummary: string;
  recoveryInstructions: string;
  createdAt: string;
}

const formSchema = z.object({
  age: z.number().min(1).max(120),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  language: z.enum(["ENGLISH", "HINDI", "GUJARATI"]),
});

interface ProfileContentProps {
  userId: string;
}

export function ProfileContent({ userId }: ProfileContentProps) {
  const [dischargeSummaries, setDischargeSummaries] = useState<
    DischargeSummary[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 0,
      gender: "MALE",
      phone: "",
      language: "ENGLISH",
    },
  });

  useEffect(() => {
    fetchPatientData();
    fetchDischargeSummaries();
  }, [userId]);

  const fetchDischargeSummaries = async () => {
    try {
      const response = await fetch(`/api/discharge-summary/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setDischargeSummaries(data);
      }
    } catch (error) {
      console.error("Error fetching discharge summaries:", error);
      toast.error("Failed to load discharge summaries");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSummary = async (summaryId: string) => {
    try {
      const response = await fetch(`/api/discharge-summary/${summaryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Summary deleted successfully");
        fetchDischargeSummaries();
      } else {
        toast.error("Failed to delete summary");
      }
    } catch (error) {
      console.error("Error deleting summary:", error);
      toast.error("Something went wrong");
    }
  };

  const fetchPatientData = async () => {
    try {
      const response = await fetch(`/api/patient/${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          form.reset({
            age: data.age,
            gender: data.gender,
            phone: data.phone,
            language: data.language,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("age", values.age.toString());
      formData.append("gender", values.gender);
      formData.append("phone", values.phone);
      formData.append("language", values.language);

      const response = await fetch("/api/patient/update", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast.success("Profile updated successfully");
        fetchPatientData();
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>
            Update your personal details and medical information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter your age"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number.parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Enter phone number"
                            className="pl-10"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Language</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ENGLISH">English</SelectItem>
                          <SelectItem value="HINDI">Hindi</SelectItem>
                          <SelectItem value="GUJARATI">Gujarati</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" />
                    <span className="animate-pulse">Updating...</span>
                  </>
                ) : (
                  "Update Profile"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Discharge Summaries ({dischargeSummaries.length})
              </CardTitle>
              <CardDescription>
                Manage your uploaded discharge summaries and medical documents
              </CardDescription>
            </div>
            <Button asChild>
              <Link href="/discharge-summary">
                <Plus className="mr-2 h-4 w-4" />
                Add New Summary
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {dischargeSummaries.length > 0 ? (
            <div className="space-y-4">
              {dischargeSummaries.map((summary) => (
                <div
                  key={summary.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{summary.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {summary.diagnosis.substring(0, 60)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Uploaded:{" "}
                        {new Date(summary.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Processed</Badge>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/discharge-summary/${summary.id}`}>
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteSummary(summary.id)}
                    >
                      <Trash2 className="mr-1 h-3 w-3" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No Discharge Summaries
              </h3>
              <p className="text-muted-foreground mb-4">
                Upload your first discharge summary to get started with
                personalized healthcare plans.
              </p>
              <Button asChild>
                <Link href="/discharge-summary">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Discharge Summary
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
