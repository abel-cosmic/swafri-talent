export const ROUTES = {
  home: "/",
  submit: "/submit",
  talents: "/talents",
  talentDetailTemplate: "/talents/[id]",
  adminLogin: "/admin/login",
  adminDashboard: "/admin",
  adminUsers: "/admin/users",
  adminTalentEditTemplate: "/admin/talents/[id]/edit",
  routesViewer: "/routes",
  apiAuthCatchAll: "/api/auth/[...all]",
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]
