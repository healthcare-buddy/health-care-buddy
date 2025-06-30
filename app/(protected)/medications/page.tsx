import { Suspense } from "react";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { MedicationsSkeleton } from "@/components/LoadingSkeleton";
import { MedicationsContent } from "@/components/user/MedicationsContent";

export default async function MedicationsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Medications</h1>
        <p className="text-muted-foreground">
          Manage your medications and set up reminders
        </p>
      </div>

      <Suspense fallback={<MedicationsSkeleton />}>
        <MedicationsContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}
