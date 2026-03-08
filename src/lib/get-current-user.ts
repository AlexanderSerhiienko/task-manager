import { getCurrentUserFromSession } from "@/server/access-control";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const user = await getCurrentUserFromSession();
  if (!user) {
    redirect("/");
  }

  return user;
}
