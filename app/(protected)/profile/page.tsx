import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ProfileSkeleton } from "@/components/LoadingSkeleton";
import { ProfileContent } from "@/components/user/ProfileContent";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and medical details
        </p>
      </div>

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent userId={session.user.id} />
      </Suspense>
    </div>
  );
}
