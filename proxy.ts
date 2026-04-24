import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { auth } from "@/lib/auth";
import { ROUTES } from "@/lib/routes";

export async function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith(ROUTES.adminDashboard)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith(ROUTES.adminLogin)) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const loginUrl = new URL(ROUTES.adminLogin, request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
