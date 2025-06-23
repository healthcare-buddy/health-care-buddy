import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProgressContent } from "@/components/ProgressContent";
import { ProgressSkeleton } from "@/components/LoadingSkeleton";

export default async function ProgressPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Progress Report</h1>
        <p className="text-muted-foreground">
          Track your recovery progress and treatment adherence
        </p>
      </div>

      <Suspense fallback={<ProgressSkeleton />}>
        <ProgressContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}
