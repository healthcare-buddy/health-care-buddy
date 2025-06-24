import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ViewDischargeSummaryContent } from "@/components/ViewDischargeSummaryContent";
import { ViewDischargeSummarySkeleton } from "@/components/LoadingSkeleton";

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
