// src/configMaker/components/placeholders/usePlaceholderValues.ts
import { ref, computed, watch } from 'vue'
import { PlaceholderValueSchema, PlaceholderValueType } from '@/types/'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

export function usePlaceholderValues(placeholderId: string, isModal = false) {
  // ストアを使用
  const omikujiStore = useOmikujiStore()

  // リアクティブデータ
  const localValues = ref<Array<PlaceholderValueType>>([])
  const placeholderName = ref('')

  // 現在のプレースホルダーデータ
  const currentPlaceholder = computed(() => omikujiStore.getCategoryMap('placeholders')[placeholderId])

  // 初期化
  const initializeValues = () => {
    const placeholder = currentPlaceholder.value
    placeholderName.value = placeholder?.name || ''

    if (placeholder?.values) {
      localValues.value = JSON.parse(JSON.stringify(placeholder.values))
    } else {
      localValues.value = [PlaceholderValueSchema.parse({})]
    }
  }

  // 値の操作
  const addValue = () => {
    localValues.value.push(PlaceholderValueSchema.parse({}))
  }

  const removeValue = (index: number) => {
    if (localValues.value.length <= 1) return
    localValues.value.splice(index, 1)
  }

  const duplicateValue = (index: number) => {
    const original = localValues.value[index]
    const duplicated = JSON.parse(JSON.stringify(original))
    duplicated.content = `${original.content} (コピー)`
    localValues.value.splice(index + 1, 0, duplicated)
  }

  // 直接編集版の場合、localValuesの変更をリアルタイム更新
  if (!isModal) {
    watch(
      localValues,
      (newValues) => {
        omikujiStore.updateRecordProperty('placeholders', placeholderId, 'values', newValues)
      },
      { deep: true }
    )
  }

  return {
    localValues,
    placeholderName,
    currentPlaceholder,
    initializeValues,
    addValue,
    removeValue,
    duplicateValue,
  }
}
