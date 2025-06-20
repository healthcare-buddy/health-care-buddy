import ThemeSwitcher from "@/components/ThemeSwitcher";
import { LucideHospital } from "lucide-react";
import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
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
