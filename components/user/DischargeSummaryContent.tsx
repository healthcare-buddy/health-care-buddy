"use client";

import type React from "react";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle,
  Eye,
  Trash2,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { generateDischargeSummaryPDF } from "@/lib/pdf-generator";

interface DischargeSummaryContentProps {
  userId: string;
}

interface ExtractedData {
  diagnosis: string;
  medications: string;
  treatmentSummary: string;
  recoveryInstructions: string;
  followUpRequired: string;
  restrictions: string;
}

interface DischargeSummary {
  id: string;
  fileName: string;
  diagnosis: string;
  medications: string;
  treatmentSummary: string;
  recoveryInstructions: string;
  createdAt: string;
}

interface PatientInfo {
  name: string;
  age: number;
  gender: string;
}

export function DischargeSummaryContent({
  userId,
}: DischargeSummaryContentProps) {
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [existingSummaries, setExistingSummaries] = useState<
    DischargeSummary[]
  >([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [patientInfo, setPatientInfo] = useState<PatientInfo | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPatientInfo = useCallback(async () => {
    try {
      const response = await fetch(`/api/patient/${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (data) {
          setPatientInfo({
            name: data.user.name,
            age: data.age,
            gender: data.gender,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching patient info:", error);
    }
  }, [userId]);

  const fetchExistingSummaries = useCallback(async () => {
    try {
      const response = await fetch(`/api/discharge-summary/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setExistingSummaries(data);
      }
    } catch (error) {
      console.error("Error fetching summaries:", error);
    }
  }, [userId]);

  useEffect(() => {
    fetchExistingSummaries();
    fetchPatientInfo();
  }, [fetchExistingSummaries, fetchPatientInfo]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const file = files[0];

    if (
      file &&
      (file.type === "application/pdf" || file.type.startsWith("image/"))
    ) {
      setSelectedFile(file);
      toast.success("File selected successfully");
    } else {
      toast.error("Please select a PDF or image file");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type === "application/pdf" || file.type.startsWith("image/")) {
        setSelectedFile(file);
        toast.success("File selected successfully");
      } else {
        toast.error("Please select a PDF or image file");
      }
    }
  };

  const processDocument = async () => {
    if (!selectedFile && !textInput.trim()) {
      toast.error("Please upload a file or enter text");
      return;
    }

    setIsProcessing(true);
    try {
      let response;

      if (selectedFile) {
        // Process file upload
        const formData = new FormData();
        formData.append("file", selectedFile);

        response = await fetch("/api/discharge-summary/process-file", {
          method: "POST",
          body: formData,
        });
      } else {
        // Process text input
        response = await fetch("/api/discharge-summary/process-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: textInput,
            userId,
          }),
        });
      }

      if (response.ok) {
        const data = await response.json();
        setExtractedData(data.extractedData);
        toast.success("Document processed successfully!");

        // Reset form
        setSelectedFile(null);
        setTextInput("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Refresh existing summaries
        fetchExistingSummaries();
      } else {
        const error = await response.json();
        toast.error(error.message || "Failed to process document");
      }
    } catch (error) {
      console.error("Error processing document:", error);
      toast.error("Something went wrong");
    } finally {
      setIsProcessing(false);
    }
  };

  const saveExtractedData = async () => {
    if (!extractedData) return;

    try {
      const response = await fetch("/api/discharge-summary/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          extractedData,
          fileName: selectedFile?.name || "Manual Entry",
        }),
      });

      if (response.ok) {
        toast.success("Discharge summary saved successfully!");
        setExtractedData(null);
        fetchExistingSummaries();
      } else {
        toast.error("Failed to save discharge summary");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Something went wrong");
    }
  };

  const deleteSummary = async (summaryId: string) => {
    try {
      const response = await fetch(`/api/discharge-summary/${summaryId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Summary deleted successfully");
        fetchExistingSummaries();
      } else {
        toast.error("Failed to delete summary");
      }
    } catch (error) {
      console.error("Error deleting summary:", error);
      toast.error("Something went wrong");
    }
  };

  const downloadReport = () => {
    if (!extractedData) return;

    // Create a temporary summary data structure for PDF generation using extracted data
    const tempSummaryData = {
      id: "temp-analysis",
      fileName: selectedFile?.name || "discharge-analysis.pdf",
      diagnosis: extractedData.diagnosis,
      medications: extractedData.medications,
      treatmentSummary: extractedData.treatmentSummary,
      recoveryInstructions: extractedData.recoveryInstructions,
      followUpRequired: extractedData.followUpRequired || "Not specified",
      restrictions: extractedData.restrictions || "Not specified",
      createdAt: new Date().toISOString(),
      parsedAt: new Date().toISOString(),
      patient: {
        age: patientInfo?.age || 0,
        gender: patientInfo?.gender || "Not specified",
        user: {
          name: patientInfo?.name || "Patient",
        },
      },
    };

    try {
      generateDischargeSummaryPDF(tempSummaryData);
      toast.success("Report downloaded successfully!");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Upload Document</TabsTrigger>
          <TabsTrigger value="manual">Manual Entry</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="mr-2 h-5 w-5" />
                Upload Discharge Summary
              </CardTitle>
              <CardDescription>
                Upload your discharge summary document (PDF or image format)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* File Dropzone */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-muted-foreground/50"
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {selectedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <FileText className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedFile(null);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Upload className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">Drop your file here</p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse (PDF, JPG, PNG)
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
              </div>

              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {selectedFile && (
                <Button
                  onClick={processDocument}
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Document...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Process Document
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Manual Entry
              </CardTitle>
              <CardDescription>
                Enter your discharge summary details manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="discharge-text">Discharge Summary Text</Label>
                <Textarea
                  id="discharge-text"
                  placeholder="Enter your complete discharge summary here including diagnosis, medications, treatment details, recovery instructions, etc."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="min-h-[200px]"
                />
                <p className="text-xs text-muted-foreground">
                  {textInput.length}/5000 characters
                </p>
              </div>

              <Button
                onClick={processDocument}
                disabled={isProcessing || !textInput.trim()}
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing Text...
                  </>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Process Text
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Extracted Data Preview */}
      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
              Extracted Information
            </CardTitle>
            <CardDescription>
              Review the extracted information before saving
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label className="text-sm font-medium">Diagnosis</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {extractedData.diagnosis}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Medications</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {extractedData.medications}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Treatment Summary</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {extractedData.treatmentSummary}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Recovery Instructions
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {extractedData.recoveryInstructions}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Follow-up Required
                </Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {extractedData.followUpRequired}
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium">Restrictions</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  {extractedData.restrictions}
                </p>
              </div>
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button
                onClick={downloadReport}
                variant="outline"
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button onClick={saveExtractedData} className="flex-1">
                <CheckCircle className="mr-2 h-4 w-4" />
                Save Summary
              </Button>
              <Button
                variant="outline"
                onClick={() => setExtractedData(null)}
                className="flex-1"
              >
                <X className="mr-2 h-4 w-4" />
                Discard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Existing Summaries */}
      {existingSummaries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Previous Discharge Summaries ({existingSummaries.length})
            </CardTitle>
            <CardDescription>
              Your previously uploaded and processed discharge summaries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {existingSummaries.map((summary) => (
                <div
                  key={summary.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-sm">{summary.fileName}</p>
                      <p className="text-xs text-muted-foreground">
                        {summary.diagnosis.substring(0, 50)}...
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="mr-1 h-3 w-3" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Discharge Summary
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;
                            {summary.fileName}&quot;? This action cannot be
                            undone. This will permanently delete the discharge
                            summary and all associated data.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => deleteSummary(summary.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Download Report Button */}
      {extractedData && (
        <div className="flex justify-end">
          <Button onClick={downloadReport} className="w-full max-w-xs">
            <FileText className="mr-2 h-4 w-4" />
            Download Discharge Summary Report
          </Button>
        </div>
      )}
    </div>
  );
}
