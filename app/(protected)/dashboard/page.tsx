import SignOutButton from "@/components/form/SignOutButton";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { headers } from "next/headers";
import React from "react";

async function getUsers() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return "Not authenticated";
  }
  const accounts = await authClient.listAccounts();
  return accounts;
}

const DashboardPage = async () => {
  const users = await getUsers();
  console.log("Users:", users);
  return (
    <div className="flex items-center justify-center h-screen">
      <SignOutButton />
    </div>
  );
};

export default DashboardPage;
