// src\ConfigMaker\components\placeholders\composables\usePlaceholders.ts
import { computed, ref } from 'vue'
import { DefaultPlaceholders, defaultPlaceholdersLabels } from '@/types/OmikujiProcess/DefaultPlaceholders'
import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { PlaceholderSchema, PlaceholderType } from '@/types/OmikujiData/PlaceholderSchema'
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/GameScriptsMap'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

// FIXME:コード量が多いので1ファイル100行程度に分割して欲しい。
export function usePlaceholders(initialActions?: PostActionType[]) {
  const omikujiStore = useOmikujiStore()
  const selectedEditorColor = ref<string | undefined>()
  const randomValueTrigger = ref(0) // ランダム値更新用のトリガー

  // プロップスからactionsをcomputedで管理
  const actions = computed<PostActionType[]>(() => initialActions || [])

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
    if (!actions.value.length) return false

    const placeholderPattern = `<<${placeholderId}>>`
    return actions.value.some(
      (action) =>
        action.wordParty?.includes(placeholderPattern) ||
        action.messageContent?.includes(placeholderPattern) ||
        action.messageToast?.includes(placeholderPattern)
    )
  }

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

  // 個別のランダム値トリガーを管理
  const individualRandomTriggers = ref<Record<string, number>>({})

  // 個別のランダム値を取得（特定のプレースホルダー用）
  const getRandomValue = (placeholder: PlaceholderType): string => {
    // 個別トリガーまたはグローバルトリガーを参照
    const individualTrigger = individualRandomTriggers.value[placeholder.id] || 0
    const globalTrigger = randomValueTrigger.value

    // いずれかのトリガーを参照してリアクティブにする
    void (individualTrigger + globalTrigger)

    if (!placeholder.values?.length) return ''
    const randomIndex = Math.floor(Math.random() * placeholder.values.length)
    const selectedValue = placeholder.values[randomIndex]
    return typeof selectedValue === 'object' ? selectedValue.content : selectedValue || ''
  }

  // 特定のプレースホルダーのランダム値を更新
  const refreshRandomValue = (placeholderId?: string) => {
    if (placeholderId) {
      // 個別更新
      if (!individualRandomTriggers.value[placeholderId]) {
        individualRandomTriggers.value[placeholderId] = 0
      }
      individualRandomTriggers.value[placeholderId]++
    } else {
      // 全体更新
      randomValueTrigger.value++
    }
  }

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

  // editorColorによるフィルタリング用の色オプション
  const editorColorOptions = computed(() => {
    const colors = new Set<string | undefined>()

    allPlaceholders.value.forEach((placeholder) => {
      const color = (placeholder as any).editorColor
      colors.add(color)
    })

    const colorList = Array.from(colors).sort((a, b) => {
      // undefinedを最初に配置
      if (a === undefined) return -1
      if (b === undefined) return 1
      return a.localeCompare(b)
    })

    return colorList.map((color) => ({
      value: color,
      label: color === undefined ? 'カラーなし' : color,
      count: allPlaceholders.value.filter((p) => (p as any).editorColor === color).length,
    }))
  })

  // フィルタリングされたプレースホルダー
  const filteredPlaceholders = computed(() => {
    if (selectedEditorColor.value === undefined) {
      return allPlaceholders.value
    }

    return allPlaceholders.value.filter((placeholder) => {
      const placeholderColor = (placeholder as any).editorColor
      return placeholderColor === selectedEditorColor.value
    })
  })

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
    isPlaceholderUsed,
    getRandomValue,
    refreshRandomValue,

    // 補助データ
    defaultPlaceholders: computed(() => defaultPlaceholders.value.map((p) => p.id)),
    stats,
  }
}
