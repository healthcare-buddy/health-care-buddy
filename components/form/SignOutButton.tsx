"use client";
import React from "react";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const SignOutButton = ({ className }: { className?: string }) => {
  const router = useRouter();

  async function SignOut() {
    await authClient.signOut();
    toast.success("You have successfully signed out.");
    router.push("/");
    router.refresh();
  }

  return (
    <Button onClick={SignOut} variant={"destructive"} className={className}>
      Sign Out <LogOut />
    </Button>
  );
};

export default SignOutButton;
