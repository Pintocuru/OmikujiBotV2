// src/configMaker/components/placeholders/composables/usePlaceholderData.ts
import { computed, Ref } from 'vue'
import { DefaultPlaceholders, defaultPlaceholdersLabels } from '@/types/OmikujiProcess/DefaultPlaceholders'
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
  const placeholderContentMap = new Map<DefaultPlaceholders, string>([
    ['user', '(ユーザー名)'],
    ['price', '(ギフト金額)'],
    ['lc', '(コメント番号)'],
    ['tc', '(個人コメント数)'],
    ['viewer', '(視聴ユーザー数)'],
    ['upVote', '(高評価数)'],
  ])

  const priorityOrder: Record<DefaultPlaceholders, number> = {
    user: 1,
    price: 2,
    lc: 3,
    tc: 4,
    viewer: 5,
    upVote: 6,
  }

  // 選択されたルールデータを取得
  const selectedRulesCommentData = computed(() => {
    if (omikujiStore.selectedCategory !== 'comments') return null
    const ruleId = omikujiStore.selectedRuleId
    return ruleId ? omikujiStore.getCategoryMap('comments')[ruleId] : null
  })

  // デフォルトプレースホルダーを生成
  const defaultPlaceholders = computed((): PlaceholderType[] => {
    return (Object.keys(defaultPlaceholdersLabels) as DefaultPlaceholders[]).map((id) => {
      const contentValue = placeholderContentMap.get(id) ?? ''
      return PlaceholderSchema.parse({
        id,
        name: defaultPlaceholdersLabels[id],
        editorColor: '#FEFEFE',
        values: [{ content: contentValue }],
      })
    })
  })

  // ゲームスクリプトのプレースホルダーを取得
  // FIXME:editorColor はゲームスクリプトのものを使う
  const scriptPlaceholders = computed((): PlaceholderType[] => {
    const rulesComment = selectedRulesCommentData.value
    if (!rulesComment?.scriptId) return []

    const script = gameScriptMap[rulesComment.scriptId]
    return (
      script.placeholders?.map(
        (item): PlaceholderType =>
          PlaceholderSchema.parse({
            id: item.key,
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

    const scriptPlaceholderIds = new Set(scriptPlaceholders.value.map((p) => p.id))

    return placeholders.sort((a, b) => {
      const aUsed = usedPlaceholderIds.value.has(a.id)
      const bUsed = usedPlaceholderIds.value.has(b.id)
      const aIsScript = scriptPlaceholderIds.has(a.id)
      const bIsScript = scriptPlaceholderIds.has(b.id)

      // 1. 使用中のものが最優先
      if (aUsed !== bUsed) return aUsed ? -1 : 1

      // FIXME:使用中のもの 以外は、editorColor > id の順でソートするように変更
      // 2. 使用中でない場合、スクリプトプレースホルダーが優先
      if (!aUsed && !bUsed && aIsScript !== bIsScript) {
        return aIsScript ? -1 : 1
      }

      // 3. 優先順位（デフォルトプレースホルダー）
      const aPriority = priorityOrder[a.id as DefaultPlaceholders] ?? Number.MAX_SAFE_INTEGER
      const bPriority = priorityOrder[b.id as DefaultPlaceholders] ?? Number.MAX_SAFE_INTEGER

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      // 4. 名前順
      const aName = a.name || a.id
      const bName = b.name || b.id
      return aName.localeCompare(bName, 'ja')
    })
  })

  return {
    allPlaceholders,
    usedPlaceholderIds,
    defaultPlaceholders: computed(() => defaultPlaceholders.value.map((p) => p.id)),
  }
}
