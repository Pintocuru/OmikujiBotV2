// src/ConfigMaker/components/events/composables/useWeightCalculation.ts
import { computed, Ref } from 'vue'

type WeightItem = {
  weight: number
  isPriority?: boolean
}
export const useWeightCalculation = <T extends WeightItem>(items: Ref<T[]>) => {
  // 全体の重みの合計を計算（isPriority === true は除外）
  const totalWeight = computed(() =>
    items.value.reduce((sum, item) => {
      if (item.isPriority) return sum
      return sum + (item.weight || 0)
    }, 0)
  )

  // 個別アイテムの出現率を計算
  const getWeightPercentage = (weight: number): string => {
    if (totalWeight.value === 0) return '0.00'
    return ((weight / totalWeight.value) * 100).toFixed(2)
  }

  return {
    totalWeight,
    getWeightPercentage,
  }
}
