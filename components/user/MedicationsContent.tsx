"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pill,
  Clock,
  AlertTriangle,
  Plus,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { MedicationsSkeleton } from "../LoadingSkeleton";

interface MedicationsContentProps {
  userId: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  sideEffects?: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  isActive: boolean;
  createdAt: string;
  dailyTaken: { [date: string]: boolean };
  remainingDays: number;
}

export function MedicationsContent({ userId }: MedicationsContentProps) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMedications();
  }, [userId]);

  const fetchMedications = async () => {
    try {
      const response = await fetch(`/api/medications/fetch/${userId}`);
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        setMedications(data);
      }
    } catch (error) {
      console.error("Error fetching medications:", error);
      toast.error("Failed to load medications");
    } finally {
      setIsLoading(false);
    }
  };

  const updateMedicationPriority = async (
    medicationId: string,
    priority: "HIGH" | "MEDIUM" | "LOW"
  ) => {
    try {
      const response = await fetch(
        `/api/medications/${medicationId}/priority`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priority }),
        }
      );

      if (response.ok) {
        setMedications((prev) =>
          prev.map((med) =>
            med.id === medicationId ? { ...med, priority } : med
          )
        );
        toast.success("Priority updated successfully");
      }
    } catch (error) {
      console.error("Error updating priority:", error);
      toast.error("Failed to update priority");
    }
  };

  const markMedicationTaken = async (
    medicationId: string,
    date: string,
    taken: boolean
  ) => {
    try {
      const response = await fetch(`/api/medications/${medicationId}/taken`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, taken }),
      });

      if (response.ok) {
        setMedications((prev) =>
          prev.map((med) =>
            med.id === medicationId
              ? { ...med, dailyTaken: { ...med.dailyTaken, [date]: taken } }
              : med
          )
        );
        toast.success(
          taken
            ? "Medication marked as taken"
            : "Medication marked as not taken"
        );
      }
    } catch (error) {
      console.error("Error updating medication status:", error);
      toast.error("Failed to update medication status");
    }
  };

  const calculateRemainingDays = (
    duration: string,
    createdAt: string
  ): number => {
    const created = new Date(createdAt);
    const now = new Date();
    const daysPassed = Math.floor(
      (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Extract number from duration string (e.g., "5 days" -> 5)
    const durationMatch = duration.match(/(\d+)/);
    const totalDays = durationMatch ? Number.parseInt(durationMatch[1]) : 0;

    return Math.max(0, totalDays - daysPassed);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "destructive";
      case "MEDIUM":
        return "default";
      case "LOW":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const today = new Date().toISOString().split("T")[0];

  if (isLoading) {
    return <MedicationsSkeleton />;
  }

  if (medications.length === 0) {
    return (
      <div className="text-center py-8 md:py-12">
        <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Medications</h3>
        <p className="text-muted-foreground mb-4 px-4">
          No active medications found. Upload your discharge summary to get
          started.
        </p>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Medication
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Today's Schedule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <Clock className="mr-2 h-5 w-5" />
            {"Today's"} Schedule
          </CardTitle>
          <CardDescription>Your medication schedule for today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:gap-4 md:grid-cols-3">
            {/* Morning */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Morning</h4>
              <div className="space-y-2">
                {medications
                  .filter(
                    (med) =>
                      med.frequency.toLowerCase().includes("morning") ||
                      med.frequency.toLowerCase().includes("daily")
                  )
                  .map((medication) => (
                    <div
                      key={`morning-${medication.id}`}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm max-sm:flex-col max-sm:gap-y-5 "
                    >
                      <div className="flex items-center space-x-2 min-w-0 sm:flex-1">
                        <Checkbox
                          checked={medication.dailyTaken[today] || false}
                          onCheckedChange={(checked) =>
                            markMedicationTaken(
                              medication.id,
                              today,
                              checked as boolean
                            )
                          }
                        />
                        <div className="min-w-0 flex-1 ">
                          <p className="font-medium truncate text-wrap">
                            {medication.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {medication.dosage}
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col sm:items-end items-center max-sm:justify-center max-sm:gap-2  sm:space-y-1 ml-2">
                        <Badge
                          variant={getPriorityColor(medication.priority)}
                          className="text-xs"
                        >
                          {medication.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          8:00 AM
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Afternoon */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Afternoon</h4>
              <div className="space-y-2">
                {medications
                  .filter(
                    (med) =>
                      med.frequency.toLowerCase().includes("afternoon") ||
                      med.frequency.toLowerCase().includes("twice")
                  )
                  .map((medication) => (
                    <div
                      key={`afternoon-${medication.id}`}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Checkbox
                          checked={medication.dailyTaken[today] || false}
                          onCheckedChange={(checked) =>
                            markMedicationTaken(
                              medication.id,
                              today,
                              checked as boolean
                            )
                          }
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {medication.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {medication.dosage}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1 ml-2">
                        <Badge
                          variant={getPriorityColor(medication.priority)}
                          className="text-xs"
                        >
                          {medication.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          2:00 PM
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Evening */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm">Evening</h4>
              <div className="space-y-2">
                {medications
                  .filter(
                    (med) =>
                      med.frequency.toLowerCase().includes("evening") ||
                      med.frequency.toLowerCase().includes("night")
                  )
                  .map((medication) => (
                    <div
                      key={`evening-${medication.id}`}
                      className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm"
                    >
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <Checkbox
                          checked={medication.dailyTaken[today] || false}
                          onCheckedChange={(checked) =>
                            markMedicationTaken(
                              medication.id,
                              today,
                              checked as boolean
                            )
                          }
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate">
                            {medication.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {medication.dosage}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1 ml-2">
                        <Badge
                          variant={getPriorityColor(medication.priority)}
                          className="text-xs"
                        >
                          {medication.priority}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          8:00 PM
                        </Badge>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* All Medications */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl md:text-2xl font-bold">All Medications</h2>
          <Button className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Medication
          </Button>
        </div>

        {medications.map((medication) => {
          const remainingDays = calculateRemainingDays(
            medication.duration,
            medication.createdAt
          );

          return (
            <Card key={medication.id}>
              <CardContent className="p-4 md:p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <Pill className="h-5 w-5 text-primary flex-shrink-0" />
                      <h3 className="text-lg font-semibold truncate">
                        {medication.name}
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant={getPriorityColor(medication.priority)}>
                        {medication.priority}
                      </Badge>
                      <Badge variant="secondary">{medication.frequency}</Badge>
                      {remainingDays <= 3 && remainingDays > 0 && (
                        <Badge
                          variant="destructive"
                          className="flex items-center"
                        >
                          <Calendar className="mr-1 h-3 w-3" />
                          {remainingDays} days left
                        </Badge>
                      )}
                      {remainingDays === 0 && (
                        <Badge variant="destructive">Course Complete</Badge>
                      )}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Dosage</p>
                      <p className="text-sm font-medium">{medication.dosage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Duration</p>
                      <p className="text-sm font-medium">
                        {medication.duration}
                      </p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Instructions
                    </p>
                    <p className="text-sm">{medication.instructions}</p>
                  </div>

                  {/* Side Effects */}
                  {medication.sideEffects && (
                    <div className="flex items-start space-x-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded">
                      <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                          Side Effects
                        </p>
                        <p className="text-sm text-orange-600 dark:text-orange-400">
                          {medication.sideEffects}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Controls */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Priority:</span>
                        <Select
                          value={medication.priority}
                          onValueChange={(value: "HIGH" | "MEDIUM" | "LOW") =>
                            updateMedicationPriority(medication.id, value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Taken Today:</span>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={medication.dailyTaken[today] || false}
                            onCheckedChange={(checked) =>
                              markMedicationTaken(
                                medication.id,
                                today,
                                checked as boolean
                              )
                            }
                          />
                          {medication.dailyTaken[today] && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Reminders</span>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
