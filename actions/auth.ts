"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { adminLoginSchema } from "@/lib/schemas";
import type { ActionResult } from "@/types/actions";

export async function adminLogin(input: unknown): Promise<ActionResult> {
  const parsed = adminLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, errorType: "validation", fieldErrors: parsed.error.flatten().fieldErrors };
  }

  try {
    await auth.api.signInEmail({
      headers: await headers(),
      body: parsed.data,
    });
    return { success: true };
  } catch {
    return { success: false, error: "Invalid credentials." };
  }
}

export async function adminLogout(): Promise<ActionResult> {
  try {
    await auth.api.signOut({ headers: await headers() });
    return { success: true };
  } catch {
    return { success: false, error: "Unable to log out." };
  }
}
