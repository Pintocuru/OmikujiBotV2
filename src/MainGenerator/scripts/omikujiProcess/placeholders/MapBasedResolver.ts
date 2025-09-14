// src/MainGenerator/scripts/omikujiProcess/placeholders/MapBasedResolver.ts
import { PlaceholderType, PlaceholderValueType } from '@/types/'

/**
 * マップベースのプレースホルダー解決クラス
 * 時間とユーザーIDに基づいた決定的な値選択を行う
 */
export class MapBasedResolver {
  /**
   * mapType に基づいた値の解決
   */
  resolveWithMap(placeholder: PlaceholderType, values: PlaceholderValueType[], userId: string): PlaceholderValueType {
    // 1. 時間ベースのシード値を生成
    const timeSeed = this.generateTimeSeed(placeholder.mapType!)

    // 2. values配列をシャッフル（その日/時間で固定）
    const shuffledValues = this.shuffleValuesWithSeed(values, timeSeed)

    // 3. ユーザーIDに基づいて1つを選択
    const userHash = this.computeHash(userId)
    const combinedHash = (timeSeed ^ userHash) >>> 0
    const index = combinedHash % shuffledValues.length

    return shuffledValues[index]
  }

  /**
   * ユーザーの順位を計算
   */
  calculateRankForUser(placeholder: PlaceholderType, values: PlaceholderValueType[], userId: string): number {
    const timeSeed = this.generateTimeSeed(placeholder.mapType!)
    const shuffledIndices = this.shuffleIndicesWithSeed(values.length, timeSeed)

    const userHash = this.computeHash(userId)
    const combinedHash = (timeSeed ^ userHash) >>> 0
    const userPosition = combinedHash % shuffledIndices.length

    // シャッフル後の位置 + 1 が順位
    return userPosition + 1
  }

  /**
   * 時間ベースのシード値生成
   */
  private generateTimeSeed(mapType: string): number {
    const now = new Date()

    switch (mapType) {
      case 'mapHourly':
        return this.computeHash(`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${now.getHours()}`)
      case 'mapDaily':
      default:
        return this.computeHash(`${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`)
    }
  }

  /**
   * シード値を使った配列シャッフル
   */
  private shuffleValuesWithSeed(values: PlaceholderValueType[], seed: number): PlaceholderValueType[] {
    const indices = this.shuffleIndicesWithSeed(values.length, seed)
    return indices.map((i) => values[i])
  }

  /**
   * インデックス配列をシード値でシャッフル
   */
  private shuffleIndicesWithSeed(length: number, seed: number): number[] {
    return Array.from({ length }, (_, i) => i).map((_, i, arr) => {
      const j = Math.abs(seed) % (i + 1)
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      seed = Math.abs((seed * 31) ^ (seed >>> 2))
      return arr[i]
    })
  }

  private computeHash(input: string): number {
    return Math.abs([...input].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0))
  }
}
