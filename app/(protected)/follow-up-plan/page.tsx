import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { FollowUpPlanContent } from "@/components/FollowUpPlanContent";
import { FollowUpPlanSkeleton } from "@/components/LoadingSkeleton";

export default async function FollowUpPlanPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Follow-up Plan</h1>
        <p className="text-muted-foreground">
          Your personalized recovery and follow-up schedule
        </p>
      </div>

      <Suspense fallback={<FollowUpPlanSkeleton />}>
        <FollowUpPlanContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}
