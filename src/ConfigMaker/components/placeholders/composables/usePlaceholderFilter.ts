// src/ConfigMaker/components/placeholders/composables/usePlaceholderFilter.ts
import { computed, ref, Ref, watch } from 'vue'
import { PlaceholderType } from '@/types/OmikujiData/PlaceholderSchema'

/**
 * プレースホルダーのフィルター機能を管理するcomposable
 */
export function usePlaceholderFilter(allPlaceholders: Ref<PlaceholderType[]>, editorColor?: Ref<string | undefined>) {
  const selectedEditorColor = ref<string | null>(null)

  // editorColorプロパティが指定されている場合は、そのカラーで初期化
  watch(
    () => editorColor?.value,
    (newEditorColor) => {
      if (newEditorColor) {
        selectedEditorColor.value = newEditorColor
      }
    },
    { immediate: true }
  )

  // editorColorによるフィルタリング用の色オプション
  const editorColorOptions = computed(() => {
    const colors = new Set<string | null>()

    allPlaceholders.value.forEach((placeholder) => {
      const color = placeholder.editorColor || null
      colors.add(color)
    })

    const colorList = Array.from(colors).sort((a, b) => {
      // nullを最後に配置
      if (a === null) return 1
      if (b === null) return -1
      return a.localeCompare(b)
    })

    return colorList.map((color) => ({
      value: color,
      label: color === null ? 'カラーなし' : color,
      count: allPlaceholders.value.filter((p) => (p.editorColor || null) === color).length,
    }))
  })

  // フィルタリングされたプレースホルダー
  const filteredPlaceholders = computed(() => {
    const targetColor = editorColor?.value || selectedEditorColor.value
    const seenIds = new Set<string>()

    return allPlaceholders.value.filter((placeholder) => {
      const placeholderColor = placeholder.editorColor || null
      if (targetColor != null && placeholderColor !== targetColor) return false

      if (seenIds.has(placeholder.id)) return false
      seenIds.add(placeholder.id)
      return true
    })
  })

  // カラー選択関数（propsでeditorColorが指定されている場合は無効）
  const selectEditorColor = (color: string | null) => {
    // propsでeditorColorが指定されている場合は選択を変更できない
    if (editorColor?.value) {
      return
    }
    selectedEditorColor.value = selectedEditorColor.value === color ? null : color
  }

  return {
    selectedEditorColor,
    editorColorOptions,
    filteredPlaceholders,
    selectEditorColor,
  }
}
