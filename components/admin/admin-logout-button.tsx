"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { adminLogout } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function AdminLogoutButton() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Button
      variant="outline"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          await adminLogout();
          router.push("/admin/login");
          router.refresh();
        })
      }
    >
      {isPending ? "Logging out..." : "Logout"}
    </Button>
  );
}
