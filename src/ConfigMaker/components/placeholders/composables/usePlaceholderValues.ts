// src/configMaker/components/placeholders/usePlaceholderValues.ts
import { ref, computed, watch } from 'vue'
import { PlaceholderValueObjectSchema, PlaceholderValueType } from '@/types/'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
import { toast } from 'vue-sonner'

export function usePlaceholderValues(placeholderId: string) {
  // Pinia store
  const omikujiStore = useOmikujiStore()

  // リアクティブデータ
  const localValues = ref<Array<PlaceholderValueType | string>>([])

  // 現在のプレースホルダーデータ
  const currentPlaceholder = computed(() => omikujiStore.getCategoryMap('placeholders')[placeholderId])

  // 初期化
  const initializeValues = () => {
    const placeholder = currentPlaceholder.value

    if (placeholder?.values) {
      localValues.value = JSON.parse(JSON.stringify(placeholder.values))
    } else {
      localValues.value = [PlaceholderValueObjectSchema.parse({})]
    }
  }

  // 値の操作
  const addValue = () => {
    localValues.value.push(PlaceholderValueObjectSchema.parse({}))
  }

  const removeValue = (index: number) => {
    if (!localValues.value.length) return
    localValues.value.splice(index, 1)
  }

  const duplicateValue = (index: number) => {
    const original = localValues.value[index]
    if (typeof original === 'string') {
      const duplicated = `${original} (コピー)`
      localValues.value.splice(index + 1, 0, duplicated)
    } else {
      const duplicated = JSON.parse(JSON.stringify(original))
      duplicated.content = `${original.content} (コピー)`
      localValues.value.splice(index + 1, 0, duplicated)
    }
  }

  // localValuesの変更をリアルタイム更新
  watch(
    localValues,
    (newValues) => {
      omikujiStore.updateRecordProperty('placeholders', placeholderId, 'values', newValues)
    },
    { deep: true }
  )

  return {
    localValues,
    currentPlaceholder,
    initializeValues,
    addValue,
    removeValue,
    duplicateValue,
  }
}
