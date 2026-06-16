// src/MainGenerator/ui/GiftRanking/composables/useRankStyle.ts

export const rankRingClass = (index: number): string => {
  if (index === 0) return 'ring-2 ring-primary'
  if (index === 1) return 'ring-2 ring-secondary'
  if (index === 2) return 'ring-2 ring-accent'
  return 'ring-1 ring-base-300'
}

export const rankBadgeClass = (index: number): string => {
  if (index === 0) return 'bg-primary text-primary-content'
  if (index === 1) return 'bg-secondary text-secondary-content'
  if (index === 2) return 'bg-accent text-accent-content'
  return 'bg-base-300 text-base-content'
}

export const rankCardClass = (index: number): string => {
  if (index === 0) return 'ring-2 ring-primary'
  if (index === 1) return 'ring-2 ring-secondary'
  if (index === 2) return 'ring-2 ring-accent'
  return ''
}

export const rankAmountClass = (index: number): string => {
  if (index === 0) return 'text-base text-primary'
  if (index === 1) return 'text-base text-secondary'
  if (index === 2) return 'text-base text-accent'
  return 'text-sm text-base-content'
}

export const formatPrice = (price: number | null): string => {
  if (price === null) return '0'
  return price.toLocaleString()
}
