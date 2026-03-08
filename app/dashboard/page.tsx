import { auth } from "@/auth";
import { DashboardClient } from "@/components/dashboard-client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) {
    redirect("/");
  }

  return (
    <main>
      <DashboardClient user={session.user ?? null} />
    </main>
  );
}
