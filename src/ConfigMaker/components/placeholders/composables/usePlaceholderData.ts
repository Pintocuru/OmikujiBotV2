// src/configMaker/components/placeholders/composables/usePlaceholderData.ts
import { computed, Ref } from 'vue'
import {
  DefaultPlaceholders,
  defaultPlaceholdersLabels,
  defaultPlaceholdersShortLabels,
} from '@/types/OmikujiProcess/DefaultPlaceholders'
import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { PlaceholderSchema, PlaceholderType } from '@/types/OmikujiData/PlaceholderSchema'
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/GameScriptsMap'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

/**
 * プレースホルダーのデータ管理を担当するcomposable
 */
export function usePlaceholderData(actions: Ref<PostActionType[]>) {
  const omikujiStore = useOmikujiStore()

  // デフォルトプレースホルダーの設定
  const placeholderContentMap = new Map(Object.entries(defaultPlaceholdersShortLabels))

  // 選択されたルールデータを取得
  const selectedRulesCommentData = computed(() => {
    if (omikujiStore.selectedCategory !== 'comments') return null
    const ruleKey = omikujiStore.selectedItemKey
    return ruleKey ? omikujiStore.getCategoryMap('comments')[ruleKey] : null
  })

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

  // ゲームスクリプトのプレースホルダーを取得
  const scriptPlaceholders = computed((): PlaceholderType[] => {
    const rulesComment = selectedRulesCommentData.value
    if (!rulesComment?.scriptId) return []

    const script = gameScriptMap[rulesComment.scriptId]
    return (
      script.placeholders?.map(
        (item): PlaceholderType =>
          PlaceholderSchema.parse({
            key: item.key,
            name: item.name,
            order: 0,
            editorColor: script.editorColor ?? '#FEFEFE',
            values: [{ content: item.value }],
          })
      ) || []
    )
  })

  // 使用されているプレースホルダーIDのセットを取得
  const usedPlaceholderIds = computed(() => {
    const usedIds = new Set<string>()

    // 早期リターンでパフォーマンス向上
    if (!actions.value.length) return usedIds

    // 全てのプレースホルダーパターンを一度に検索
    const allContent = actions.value
      .flatMap((action) => [action.wordParty || '', action.messageContent || '', action.messageToast || ''])
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
    const customPlaceholders = omikujiStore.getCategoryArray('placeholders')
    const placeholders = [...defaultPlaceholders.value, ...scriptPlaceholders.value, ...customPlaceholders]

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
