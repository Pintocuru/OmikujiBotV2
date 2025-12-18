// src/ConfigMaker/composables/useWeightCalculation.ts
import { computed, Ref } from 'vue'
import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'

export const useWeightCalculation = (omikujiItems: Ref<OmikujiItemType[]>) => {
  // 全体の重みの合計を計算
  const totalWeight = computed(() => omikujiItems.value.reduce((sum, item) => sum + (item.weight || 0), 0))

  // 個別アイテムの出現率を計算
  const getWeightPercentage = (weight: number): string => {
    if (totalWeight.value === 0) return '0.00'
    return ((weight / totalWeight.value) * 100).toFixed(2)
  }

  // 全アイテムの出現率リストを取得
  const weightPercentages = computed(() =>
    omikujiItems.value.map((item) => ({
      weight: item.weight,
      percentage: parseFloat(getWeightPercentage(item.weight)),
      percentageStr: getWeightPercentage(item.weight),
    }))
  )

  // 累積確率を計算
  const cumulativePercentages = computed(() => {
    let cumulative = 0
    return omikujiItems.value.map((item) => {
      const percentage = parseFloat(getWeightPercentage(item.weight))
      cumulative += percentage
      return {
        percentage,
        cumulative: cumulative.toFixed(2),
      }
    })
  })

  return {
    totalWeight,
    getWeightPercentage,
    weightPercentages,
    cumulativePercentages,
  }
}
