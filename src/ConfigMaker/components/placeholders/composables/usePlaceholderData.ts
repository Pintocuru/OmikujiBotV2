// src/configMaker/components/placeholders/composables/usePlaceholderData.ts
import { computed, Ref } from 'vue'
import {
  DefaultPlaceholders,
  defaultPlaceholdersLabels,
  defaultPlaceholdersShortLabels,
} from '@/types/OmikujiProcess/DefaultPlaceholders'
import { PlaceholderSchema, PlaceholderType, PostFlowType } from '@/types/OmikujiData/'
import { useGetRecordData } from '@config/stores/useGetRecordData'

/**
 * プレースホルダーのデータ管理を担当するcomposable
 */
export function usePlaceholderData(actions: Ref<PostFlowType[]>) {
  const { getCategoryArray } = useGetRecordData()

  // デフォルトプレースホルダーの設定
  const placeholderContentMap = new Map(Object.entries(defaultPlaceholdersShortLabels))

  // デフォルトプレースホルダーを生成
  const defaultPlaceholders = computed((): PlaceholderType[] => {
    return (Object.keys(defaultPlaceholdersLabels) as DefaultPlaceholders[]).map((key) => {
      const contentValue = placeholderContentMap.get(key) ?? ''
      return PlaceholderSchema.parse({
        key,
        name: defaultPlaceholdersLabels[key],
        editorColor: '#FEFEFE',
        values: [{ content: contentValue }],
      })
    })
  })

  // 使用されているプレースホルダーIDのセットを取得
  const usedPlaceholderIds = computed(() => {
    const usedIds = new Set<string>()

    // 早期リターンでパフォーマンス向上
    if (!actions.value.length) return usedIds

    // 全てのプレースホルダーパターンを一度に検索
    const allContent = actions.value
      .flatMap((action) => {
        if (action.actionType === 'message') {
          return [action.message.bubble || '']
        } else if (action.actionType === 'wordParty') {
          return [action.wordParty || '']
        }
      })
      .filter(Boolean)
      .join(' ')

    // プレースホルダーパターンのマッチングを効率化
    const placeholderRegex = /<<([^>]+)>>/g
    let match
    while ((match = placeholderRegex.exec(allContent)) !== null) {
      usedIds.add(match[1])
    }

    return usedIds
  })

  // 全プレースホルダーを取得してソート
  const allPlaceholders = computed(() => {
    const customPlaceholders = getCategoryArray('placeholders')
    const placeholders = [...defaultPlaceholders.value, ...customPlaceholders]

    return placeholders.sort((a, b) => {
      const aUsed = usedPlaceholderIds.value.has(a.key)
      const bUsed = usedPlaceholderIds.value.has(b.key)

      // 1. 使用中のものが最優先
      if (aUsed !== bUsed) return aUsed ? -1 : 1

      // 2. 使用中以外は editorColor > key の順でソート
      const aColor = a.editorColor ?? ''
      const bColor = b.editorColor ?? ''
      if (aColor !== bColor) return aColor.localeCompare(bColor, 'ja')

      return a.key.localeCompare(b.key, 'ja')
    })
  })

  return {
    allPlaceholders,
    usedPlaceholderIds,
    defaultPlaceholders: computed(() => defaultPlaceholders.value.map((p) => p.key)),
  }
}
