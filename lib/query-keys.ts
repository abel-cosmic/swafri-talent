export const queryKeys = {
  talents: (params: {
    page?: number
    search?: string
    skill?: string
    minYears?: number
    maxYears?: number
    hasResume?: boolean
    hasImage?: boolean
    sortBy?: string
    status?: string
    adminView?: boolean
  }) => ["talents", params] as const,
  talentDetail: (id: string) => ["talent", id] as const,
  users: (params: { search?: string; limit?: number; offset?: number }) => ["users", params] as const,
};
