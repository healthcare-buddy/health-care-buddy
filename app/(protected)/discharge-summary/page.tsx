import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { DischargeSummaryContent } from "@/components/user/DischargeSummaryContent";
import { DischargeSummarySkeleton } from "@/components/LoadingSkeleton";

export default async function DischargeSummaryPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Discharge Summary</h1>
        <p className="text-muted-foreground">
          Upload your discharge summary or enter the details manually
        </p>
      </div>

      <Suspense fallback={<DischargeSummarySkeleton />}>
        <DischargeSummaryContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}
