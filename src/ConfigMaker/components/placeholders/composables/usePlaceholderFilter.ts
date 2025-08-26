// src/configMaker/components/placeholders/composables/usePlaceholderFilter.ts
import { computed, ref, Ref } from 'vue'
import { PlaceholderType } from '@/types/OmikujiData/PlaceholderSchema'

/**
 * プレースホルダーのフィルター機能を管理するcomposable
 */
export function usePlaceholderFilter(allPlaceholders: Ref<PlaceholderType[]>) {
  const selectedEditorColor = ref<string | null>(null)

  // editorColorによるフィルタリング用の色オプション
  const editorColorOptions = computed(() => {
    const colors = new Set<string | null>()

    allPlaceholders.value.forEach((placeholder) => {
      const color = (placeholder as any).editorColor || null
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
      count: allPlaceholders.value.filter((p) => ((p as any).editorColor || null) === color).length,
    }))
  })

  // フィルタリングされたプレースホルダー
  const filteredPlaceholders = computed(() => {
    if (selectedEditorColor.value === null) {
      return allPlaceholders.value
    }

    return allPlaceholders.value.filter((placeholder) => {
      const placeholderColor = (placeholder as any).editorColor || null
      return placeholderColor === selectedEditorColor.value
    })
  })

  // カラー選択関数
  const selectEditorColor = (color: string | null) => {
    selectedEditorColor.value = selectedEditorColor.value === color ? null : color
  }

  return {
    selectedEditorColor,
    editorColorOptions,
    filteredPlaceholders,
    selectEditorColor,
  }
}
