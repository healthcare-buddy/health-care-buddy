import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ViewFollowUpPlanContent } from "@/components/ViewFollowUpPlanContent";

interface ViewFollowUpPlanPageProps {
  params: Promise<{ summaryId: string }>;
}

export default async function ViewFollowUpPlanPage({
  params,
}: ViewFollowUpPlanPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }
  const { summaryId } = await params;

  return (
    <div className="space-y-6">
      <Suspense fallback={<ViewFollowUpPlanSkeleton />}>
        <ViewFollowUpPlanContent summaryId={summaryId} />
      </Suspense>
    </div>
  );
}

function ViewFollowUpPlanSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-[100px] rounded-lg" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-[300px] rounded-lg" />
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
      <Skeleton className="h-[200px] rounded-lg" />
    </div>
  );
}
