import { Suspense } from "react";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ViewFollowUpPlanContent } from "@/components/user/ViewFollowUpPlanContent";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

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
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbLink href="/follow-up-plan">
                  Follow-up Plans
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>View Plan</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="space-y-6">
          <Suspense fallback={<ViewFollowUpPlanSkeleton />}>
            <ViewFollowUpPlanContent summaryId={summaryId} />
          </Suspense>
        </div>
      </div>
    </>
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
