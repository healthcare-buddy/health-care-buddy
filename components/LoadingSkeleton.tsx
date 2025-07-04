import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="h-4 w-[100px] mb-2" />
            <Skeleton className="h-8 w-[60px]" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-4">
          <Skeleton className="h-6 w-[200px] mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <Skeleton className="h-6 w-[200px] mb-4" />
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function MedicationsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="rounded-lg border p-4">
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-6 w-[150px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[180px]" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProgressSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <Skeleton className="h-4 w-[100px] mb-2" />
            <Skeleton className="h-8 w-[60px]" />
          </div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[300px] rounded-lg" />
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
    </div>
  );
}

export function DischargeSummarySkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[400px] rounded-lg" />
      <Skeleton className="h-[300px] rounded-lg" />
    </div>
  );
}

export function FollowUpPlanSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[200px] rounded-lg" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[300px] rounded-lg" />
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
    </div>
  );
}

export function ViewDischargeSummarySkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[100px] rounded-lg" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[200px] rounded-lg" />
        <Skeleton className="h-[200px] rounded-lg" />
      </div>
      <Skeleton className="h-[300px] rounded-lg" />
    </div>
  );
}

export function ViewFollowUpPlanSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[100px] rounded-lg" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[200px] rounded-lg" />
        <Skeleton className="h-[200px] rounded-lg" />
      </div>
      <Skeleton className="h-[300px] rounded-lg" />
    </div>
  );
}

export function DischargeSummariesListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex max-md:flex-col max-md:space-y-2 items-center justify-between p-4 border rounded-lg"
        >
          <div className="flex items-center space-x-3">
            <Skeleton className="h-5 w-5" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-3 w-[300px]" />
              <Skeleton className="h-3 w-[150px]" />
            </div>
          </div>
          <div className="flex items-center space-x-2 max-md:flex-col space-y-2 justify-center">
            <Skeleton className="h-6 w-[80px]" />
            <div className="flex items-center justify-center gap-2 max-md:w-full">
              <Skeleton className="h-8 w-[60px]" />
              <Skeleton className="h-8 w-[70px]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function AIAssistantSkeleton() {
  return (
    <div className="h-full space-y-4">
      <Skeleton className="h-[60px] rounded-lg" />
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-[80px] rounded-lg" />
          </div>
        ))}
      </div>
      <Skeleton className="h-[40px] rounded-lg" />
    </div>
  );
}
