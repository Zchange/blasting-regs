const FAV_KEY = 'blasting-regs:v1:favorites'
const RECENT_KEY = 'blasting-regs:v1:recent'
const FONT_KEY = 'blasting-regs:v1:font'

export type FontSize = 'sm' | 'md' | 'lg'

export interface RecentItem {
  id: string
  at: number
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function getFavorites(): string[] {
  return readJson<string[]>(FAV_KEY, [])
}

export function isFavorite(id: string): boolean {
  return getFavorites().includes(id)
}

export function toggleFavorite(id: string): boolean {
  const current = getFavorites()
  const next = current.includes(id) ? current.filter((item) => item !== id) : [id, ...current]
  localStorage.setItem(FAV_KEY, JSON.stringify(next))
  return next.includes(id)
}

export function getRecent(): RecentItem[] {
  return readJson<RecentItem[]>(RECENT_KEY, [])
}

export function pushRecent(id: string): void {
  const next = [{ id, at: Date.now() }, ...getRecent().filter((item) => item.id !== id)].slice(0, 30)
  localStorage.setItem(RECENT_KEY, JSON.stringify(next))
}

export function getFontSize(): FontSize {
  const value = localStorage.getItem(FONT_KEY)
  return value === 'sm' || value === 'lg' ? value : 'md'
}

export function setFontSize(size: FontSize): void {
  localStorage.setItem(FONT_KEY, size)
  document.documentElement.dataset.font = size
}

export function applyStoredFontSize(): void {
  document.documentElement.dataset.font = getFontSize()
}
