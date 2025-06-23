import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { AIAssistantContent } from "@/components/AiAssistantContent";
import { Skeleton } from "@/components/ui/skeleton";

export default async function AIAssistantPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">AI Assistant</h1>
        <p className="text-muted-foreground">
          Chat with your AI healthcare assistant in your preferred language
        </p>
      </div>

      <Suspense fallback={<AIAssistantSkeleton />}>
        <AIAssistantContent userId={session.user.id} />
      </Suspense>
    </div>
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
