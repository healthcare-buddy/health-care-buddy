import ThemeSwitcher from "@/components/ThemeSwitcher";
import { auth } from "@/lib/auth";
import { LucideHospital } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    return redirect("/dashboard");
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center ">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <a href="#" className="flex items-center gap-2 self-center font-medium">
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <LucideHospital className="size-4" />
          </div>
          Acme Inc.
        </a>
        {children}
        <ThemeSwitcher className="fixed bottom-10 right-10" />
      </div>
    </div>
  );
};

export default AuthLayout;
