"use client";

import { Button } from "@/components/ui/button/button";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <Button
      type="button"
      onClick={() => {
        void signOut({ callbackUrl: "/" });
      }}
      variant="secondary"
      size="sm"
      className="w-full sm:w-auto"
    >
      Logout
    </Button>
  );
}
