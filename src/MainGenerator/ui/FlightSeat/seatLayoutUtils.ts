// src\MainGenerator\ui\FlightSeat\seatLayoutUtils.ts

/**
 * 座席レイアウトタイプ
 */
export type SeatLayout = 'square' | 'pyramid' | 'inversePyramid'

/**
 * 総座席数を計算
 */
export function calculateTotalSeats(
  layout: SeatLayout,
  rows: number,
  cols: number
): number {
  switch (layout) {
    case 'square':
      return rows * cols

    case 'pyramid':
      // 1 + 2 + 3 + ... + rows
      return (rows * (rows + 1)) / 2

    case 'inversePyramid':
      // rows + (rows-1) + ... + 1
      return (rows * (rows + 1)) / 2

    default:
      return 0
  }
}

/**
 * 各行の座席数配列を計算
 */
export function calculateSeatLayout(
  layout: SeatLayout,
  rows: number,
  cols: number
): number[] {
  switch (layout) {
    case 'square':
      return Array(rows).fill(cols)

    case 'pyramid':
      return Array.from({ length: rows }, (_, i) => i + 1)

    case 'inversePyramid':
      return Array.from({ length: rows }, (_, i) => rows - i)

    default:
      return []
  }
}