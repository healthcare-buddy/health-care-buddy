import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AIAssistantContent } from "@/components/user/AiAssistantContent";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function AIAssistantPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return null; // This will be handled by the layout
  }

  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/">Healthcare Buddy</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>AI Assistant</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="h-full">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold">AI Assistant</h1>
            <p className="text-muted-foreground">
              Chat with our AI to get personalized health insights and
              recommendations.
            </p>
          </div>

          <Suspense fallback={<AIAssistantSkeleton />}>
            <AIAssistantContent userId={session.user.id} />
          </Suspense>
        </div>
      </div>
    </>
  );
}

function AIAssistantSkeleton() {
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-w-4xl mx-auto">
      <Skeleton className="h-[100px] mb-4 rounded-lg" />
      <div className="flex-1 border rounded-lg p-4">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-start gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-16 flex-1 rounded-2xl" />
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
