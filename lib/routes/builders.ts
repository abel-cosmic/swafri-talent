import { ROUTES } from "@/lib/routes"

export const routeBuilders = {
  talentDetail(id: string) {
    return `/talents/${id}`
  },
  adminTalentEdit(id: string) {
    return `/admin/talents/${id}/edit`
  },
  talentsList(params?: { page?: number; search?: string }) {
    if (!params) {
      return ROUTES.talents
    }

    const searchParams = new URLSearchParams()

    if (typeof params.page === "number" && Number.isFinite(params.page) && params.page > 0) {
      searchParams.set("page", String(params.page))
    }

    if (params.search) {
      searchParams.set("search", params.search)
    }

    const query = searchParams.toString()
    return query ? `${ROUTES.talents}?${query}` : ROUTES.talents
  },
} as const
