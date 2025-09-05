export const normalizeTag = (t: string) => t.trim().toLowerCase()

export const normalizeTags = (arr: string[] = []) =>
  arr.map((t) => normalizeTag(t)).filter(Boolean)
