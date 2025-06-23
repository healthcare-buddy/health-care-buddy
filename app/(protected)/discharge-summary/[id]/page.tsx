import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ViewDischargeSummaryContent } from "@/components/ViewDischargeSummaryContent";

interface ViewDischargeSummaryPageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewDischargeSummaryPage({
  params,
}: ViewDischargeSummaryPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/auth/signin");
  }

  const { id } = await params;

  return (
    <div className="space-y-6">
      <Suspense fallback={<ViewDischargeSummarySkeleton />}>
        <ViewDischargeSummaryContent summaryId={id} />
      </Suspense>
    </div>
  );
}

function ViewDischargeSummarySkeleton() {
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
