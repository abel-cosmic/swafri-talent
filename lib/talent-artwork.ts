export const DEFAULT_TALENT_ARTWORK = "/artwork/talent-placeholder.svg"

export function getTalentProfileImage(profileImageUrl?: string | null) {
  const trimmed = profileImageUrl?.trim()
  return trimmed ? trimmed : DEFAULT_TALENT_ARTWORK
}
