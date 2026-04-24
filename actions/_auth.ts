"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function getActionSession() {
  return auth.api.getSession({ headers: await headers() });
}

export async function requirePermission(resource: string, action: string) {
  const session = await getActionSession();
  if (!session?.user?.id) return { ok: false as const, reason: "unauthorized" as const };

  const result = await auth.api.userHasPermission({
    headers: await headers(),
    body: {
      userId: session.user.id,
      permissions: { [resource]: [action] },
    },
  });

  if (!result?.success) return { ok: false as const, reason: "forbidden" as const };
  return { ok: true as const, session };
}
