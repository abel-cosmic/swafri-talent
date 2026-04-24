import { createAccessControl, role } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const statement = {
  ...defaultStatements,
  talent: ["create", "list", "update", "approve", "reject", "delete"],
  userManagement: ["list", "create", "setRole", "ban", "delete"],
} as const;

export const ac = createAccessControl(statement);

export const superAdmin = role({
  ...adminAc.statements,
  talent: ["create", "list", "update", "approve", "reject", "delete"],
  userManagement: ["list", "create", "setRole", "ban", "delete"],
});

export const admin = role({
  talent: ["create", "list", "update", "approve", "reject", "delete"],
  userManagement: ["list"],
});

export const moderator = role({
  talent: ["list", "approve", "reject"],
});

export const user = role({});

export const roles = {
  superAdmin,
  admin,
  moderator,
  user,
};

export const roleNames = Object.keys(roles) as Array<keyof typeof roles>;
