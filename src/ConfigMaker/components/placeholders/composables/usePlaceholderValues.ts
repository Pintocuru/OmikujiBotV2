// src/ConfigMaker/components/placeholders/composables/usePlaceholderValues.ts
import { ref, computed } from 'vue'
import { WeightValuesArrayType, WeightValueSchema } from '@/types'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { useGetRecordData } from '@config/stores/useGetRecordData'

export function usePlaceholderValues(placeholderId: string) {
  // Pinia store
  const { updateRecordProperty } = useOmikujiStore()
  const { getCategoryMap } = useGetRecordData()

  // リアクティブデータ
  const localValues = ref<WeightValuesArrayType>([])
  const updateValues = () => {
    updateRecordProperty('placeholders', placeholderId, 'values', localValues.value)
  }

  // 現在のプレースホルダーデータ
  const currentPlaceholder = computed(() => getCategoryMap('placeholders')[placeholderId])

  // 初期化
  const initializeValues = () => {
    const placeholder = currentPlaceholder.value

    if (placeholder?.values) {
      localValues.value = JSON.parse(JSON.stringify(placeholder.values))
    } else {
      localValues.value = [WeightValueSchema.parse({})]
    }
  }

  // 値の操作
  const addValue = () => {
    localValues.value.push(WeightValueSchema.parse({}))
    updateValues()
  }

  const removeValue = (index: number) => {
    if (!localValues.value.length) return
    localValues.value.splice(index, 1)
    updateValues()
  }

  const duplicateValue = (index: number) => {
    const original = localValues.value[index]
    if (typeof original === 'string') {
      const duplicated = `${original}(コピー)`
      localValues.value.splice(index + 1, 0, duplicated)
      updateValues()
    } else {
      const duplicated = JSON.parse(JSON.stringify(original))
      duplicated.content = `${original.content}(コピー)`
      localValues.value.splice(index + 1, 0, duplicated)
      updateValues()
    }
  }

  return {
    localValues,
    currentPlaceholder,
    initializeValues,
    addValue,
    removeValue,
    duplicateValue,
  }
}
