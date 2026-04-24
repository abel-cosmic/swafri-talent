export function can(role: string | null | undefined, permission: string): boolean {
  const current = role ?? "user";
  const matrix: Record<string, string[]> = {
    superAdmin: [
      "talent:list",
      "talent:create",
      "talent:update",
      "talent:approve",
      "talent:reject",
      "talent:delete",
      "userManagement:list",
      "userManagement:create",
      "userManagement:setRole",
      "userManagement:ban",
      "userManagement:delete",
    ],
    admin: ["talent:list", "talent:create", "talent:update", "talent:approve", "talent:reject", "talent:delete", "userManagement:list"],
    moderator: ["talent:list", "talent:approve", "talent:reject"],
    user: [],
  };
  return matrix[current]?.includes(permission) ?? false;
}
