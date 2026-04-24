import { ROUTES } from "@/lib/routes"
import { routeBuilders } from "@/lib/routes/builders"
import { can } from "@/lib/role-permissions"

export type RouteGroup = "public" | "admin" | "dynamic" | "technical"

export type AppRouteItem = {
  key: string
  label: string
  path: string
  description?: string
  group: RouteGroup
  showInMainNav?: boolean
  showInAdminNav?: boolean
  showAsButton?: boolean
  requiresAuth?: boolean
  requiredPermission?: string
  isTemplate?: boolean
  examplePath?: string
}

export const APP_ROUTES: AppRouteItem[] = [
  {
    key: "home",
    label: "Home",
    path: ROUTES.home,
    description: "Landing page",
    group: "public",
    showInMainNav: true,
    showAsButton: true,
  },
  {
    key: "submit",
    label: "Submit Profile",
    path: ROUTES.submit,
    description: "Public profile submission form",
    group: "public",
    showInMainNav: true,
    showAsButton: true,
  },
  {
    key: "talents",
    label: "Browse Talent",
    path: ROUTES.talents,
    description: "Public approved talent listing",
    group: "public",
    showInMainNav: true,
    showAsButton: true,
  },
  {
    key: "routesViewer",
    label: "All Routes",
    path: ROUTES.routesViewer,
    description: "Complete route index",
    group: "public",
    showInMainNav: true,
    showAsButton: true,
  },
  {
    key: "adminDashboard",
    label: "Admin Dashboard",
    path: ROUTES.adminDashboard,
    description: "Moderation dashboard",
    group: "admin",
    requiresAuth: true,
    requiredPermission: "talent:list",
    showInAdminNav: true,
    showAsButton: true,
  },
  {
    key: "adminUsers",
    label: "User Management",
    path: ROUTES.adminUsers,
    description: "Role and user administration",
    group: "admin",
    requiresAuth: true,
    requiredPermission: "userManagement:list",
    showInAdminNav: true,
    showAsButton: true,
  },
  {
    key: "adminLogin",
    label: "Admin Login",
    path: ROUTES.adminLogin,
    description: "Authentication entry for admins",
    group: "admin",
    showAsButton: true,
  },
  {
    key: "talentDetailTemplate",
    label: "Talent Detail (dynamic)",
    path: ROUTES.talentDetailTemplate,
    description: "Dynamic public talent detail template",
    group: "dynamic",
    isTemplate: true,
    examplePath: routeBuilders.talentDetail("sample-id"),
    showAsButton: true,
  },
  {
    key: "adminTalentEditTemplate",
    label: "Admin Edit Talent (dynamic)",
    path: ROUTES.adminTalentEditTemplate,
    description: "Dynamic admin edit template",
    group: "dynamic",
    requiresAuth: true,
    requiredPermission: "talent:update",
    isTemplate: true,
    examplePath: routeBuilders.adminTalentEdit("sample-id"),
    showAsButton: true,
  },
  {
    key: "apiAuth",
    label: "Auth API (technical)",
    path: ROUTES.apiAuthCatchAll,
    description: "Technical auth handler route",
    group: "technical",
    isTemplate: true,
    examplePath: "/api/auth/sign-in/email",
    showAsButton: true,
  },
]

export function getMainNavRoutes() {
  return APP_ROUTES.filter((route) => route.showInMainNav)
}

export function getAdminNavRoutes(role?: string | null) {
  return APP_ROUTES.filter((route) => {
    if (route.group !== "admin" || !route.showInAdminNav) {
      return false
    }

    if (!route.requiredPermission) {
      return true
    }

    return can(role, route.requiredPermission)
  })
}

export function getRouteGroups(options?: { role?: string | null; includeRestricted?: boolean }) {
  const role = options?.role
  const includeRestricted = options?.includeRestricted ?? false
  const groups: Record<RouteGroup, AppRouteItem[]> = {
    public: [],
    admin: [],
    dynamic: [],
    technical: [],
  }

  for (const route of APP_ROUTES) {
    if (!includeRestricted && route.requiredPermission && !can(role, route.requiredPermission)) {
      continue
    }
    groups[route.group].push(route)
  }

  return groups
}
