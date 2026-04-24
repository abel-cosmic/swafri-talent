import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { toNextJsHandler } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins/admin";

import { prisma } from "@/lib/prisma";
import { ac, roles } from "@/lib/permissions";

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    adminPlugin({
      defaultRole: "user",
      adminRoles: ["superAdmin", "admin"],
      ac,
      roles,
    }),
  ],
});

export const authHandler = toNextJsHandler(auth);
