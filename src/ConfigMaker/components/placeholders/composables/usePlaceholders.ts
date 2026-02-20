// src/ConfigMaker/components/placeholders/composables/usePlaceholders.ts
import { computed, Ref } from 'vue'
import { PostFlowType } from '@/types/OmikujiData/'
import { usePlaceholderData } from './usePlaceholderData'
import { usePlaceholderFilter } from './usePlaceholderFilter'

/**
 * プレースホルダー機能の統合composable
 */
export function usePlaceholders(actions: Ref<PostFlowType[]>, editorColor?: Ref<string | undefined>) {
  // データ管理
  const { allPlaceholders, usedPlaceholderIds, defaultPlaceholders } = usePlaceholderData(actions)

  // フィルター機能
  const { selectedEditorColor, editorColorOptions, filteredPlaceholders, selectEditorColor } = usePlaceholderFilter(
    allPlaceholders,
    editorColor
  )

  // 統計情報
  const stats = computed(() => ({
    total: allPlaceholders.value.length,
    used: usedPlaceholderIds.value.size,
    unused: allPlaceholders.value.length - usedPlaceholderIds.value.size,
    filtered: filteredPlaceholders.value.length,
  }))

  return {
    // 基本データ
    selectedEditorColor,
    allPlaceholders,
    filteredPlaceholders,
    usedPlaceholderIds,
    editorColorOptions,

    // 関数
    selectEditorColor,

    // 補助データ
    defaultPlaceholders,
    stats,
  }
}
