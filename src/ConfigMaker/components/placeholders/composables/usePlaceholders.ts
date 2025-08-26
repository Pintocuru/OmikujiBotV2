// src/configMaker/components/placeholders/composables/usePlaceholders.ts
import { computed, Ref } from 'vue'
import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { usePlaceholderData } from './usePlaceholderData'
import { usePlaceholderFilter } from './usePlaceholderFilter'
import { usePlaceholderRandom } from './usePlaceholderRandom'

/**
 * プレースホルダー機能の統合composable
 * 各機能を個別のcomposableに分離して管理
 */
export function usePlaceholders(actions: Ref<PostActionType[]>) {
  // データ管理
  const { allPlaceholders, usedPlaceholderIds, defaultPlaceholders } = usePlaceholderData(actions)

  // フィルター機能
  const { selectedEditorColor, editorColorOptions, filteredPlaceholders, selectEditorColor } =
    usePlaceholderFilter(allPlaceholders)

  // ランダム値機能
  const { getRandomValue, refreshRandomValue } = usePlaceholderRandom()

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
    getRandomValue,
    refreshRandomValue,
    selectEditorColor,

    // 補助データ
    defaultPlaceholders,
    stats,
  }
}
