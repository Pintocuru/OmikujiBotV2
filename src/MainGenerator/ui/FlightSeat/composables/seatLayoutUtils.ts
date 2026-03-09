// src/MainGenerator/ui/FlightSeat/composables/seatLayoutUtils.ts
import { SeatLayout } from '@/types'

/**
 * 総座席数を計算
 */
export function calculateTotalSeats(
  layout: SeatLayout,
  rows: number,
  cols: number,
  customLayout?: number[],
  circleSeats?: number
): number {
  switch (layout) {
    case 'square':
      return rows * cols

    case 'circle':
      return circleSeats ?? 12

    case 'custom':
      return customLayout ? customLayout.reduce((sum, n) => sum + n, 0) : 0

    default:
      return 0
  }
}

/**
 * 各行の座席数配列を計算
 */
export function calculateSeatLayout(layout: SeatLayout, rows: number, cols: number, customLayout?: number[]): number[] {
  switch (layout) {
    case 'square':
      return Array(rows).fill(cols)

    case 'custom':
      return customLayout ?? [1, 2, 3, 4, 5]

    case 'circle':
      return [] // circleは配列不要

    default:
      return []
  }
}
