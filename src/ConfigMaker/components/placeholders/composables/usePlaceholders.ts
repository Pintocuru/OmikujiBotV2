// src/composables/usePlaceholders.ts
import { computed, ref } from 'vue'
import { DefaultPlaceholders, defaultPlaceholdersLabels } from '@/types/OmikujiData/CategoryType'
import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { PlaceholderSchema, PlaceholderType } from '@/types/OmikujiData/PlaceholderSchema'
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/GameScriptsMap'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

export function usePlaceholders(actions?: PostActionType[]) {
  const omikujiStore = useOmikujiStore()
  const searchQuery = ref('')

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
            id: item.key,
            name: item.name,
            order: 0,
            values: [{ content: item.value }],
          })
      ) || []
    )
  })

  // プレースホルダーが使用されているかを判定
  const isPlaceholderUsed = (placeholderId: string): boolean => {
    if (!actions?.length) return false
    const placeholderPattern = `<<${placeholderId}>>`
    return actions.some(
      (action) =>
        action.wordParty?.includes(placeholderPattern) ||
        action.messageContent?.includes(placeholderPattern) ||
        action.messageToast?.includes(placeholderPattern)
    )
  }

  // 使用されているプレースホルダーIDのセットを取得
  const usedPlaceholderIds = computed(() => {
    const usedIds = new Set<string>()
    const allPlaceholderIds = allPlaceholders.value.map((p) => p.id)

    allPlaceholderIds.forEach((id) => {
      if (isPlaceholderUsed(id)) {
        usedIds.add(id)
      }
    })

    return usedIds
  })

  // ランダムな値を取得
  const getRandomValue = (placeholder: PlaceholderType): string => {
    if (!placeholder.values?.length) return ''
    const randomIndex = Math.floor(Math.random() * placeholder.values.length)
    const selectedValue = placeholder.values[randomIndex]
    if (typeof selectedValue === 'object') return selectedValue.content
    return selectedValue || ''
  }

  // 全プレースホルダーを取得してソート
  const allPlaceholders = computed(() => {
    const customPlaceholders = omikujiStore.getCategoryArray('placeholders')
    const placeholders = [...defaultPlaceholders.value, ...scriptPlaceholders.value, ...customPlaceholders]

    const scriptPlaceholderIds = new Set(scriptPlaceholders.value.map((p) => p.id))

    return placeholders.sort((a, b) => {
      const aUsed = isPlaceholderUsed(a.id)
      const bUsed = isPlaceholderUsed(b.id)
      const aIsScript = scriptPlaceholderIds.has(a.id)
      const bIsScript = scriptPlaceholderIds.has(b.id)

      // 1. 使用中のものが最優先
      if (aUsed !== bUsed) return aUsed ? -1 : 1

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
      return aName.localeCompare(bName)
    })
  })

  // フィルタリングされたプレースホルダー
  const filteredPlaceholders = computed(() => {
    if (!searchQuery.value) return allPlaceholders.value
    const query = searchQuery.value.toLowerCase()
    return allPlaceholders.value.filter((placeholder) => {
      const name = (placeholder.name || '').toLowerCase()
      const id = placeholder.id.toLowerCase()
      const content = placeholder.values
        .map((v) => {
          if (typeof v === 'object') return v.content.toLowerCase()
          return v.toLowerCase()
        })
        .join(' ')
      return name.includes(query) || id.includes(query) || content.includes(query)
    })
  })

  return {
    searchQuery,
    allPlaceholders,
    filteredPlaceholders,
    usedPlaceholderIds,
    isPlaceholderUsed,
    getRandomValue,
    defaultPlaceholders: computed(() => defaultPlaceholders.value.map((p) => p.id)),
  }
}
