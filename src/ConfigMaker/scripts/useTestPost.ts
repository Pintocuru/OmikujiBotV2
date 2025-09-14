// src/ConfigMaker/script/useTestPost.ts - テスト投稿用
import { computed } from 'vue'
import { OmikujiItemSchema, PostActionType, BotMessage, OmikujiItemType, OmikujiDataType, RuleType } from '@/types/'
import { GameScriptManager } from '@/MainGenerator/scripts/GameScript/GameScriptManager'
import { MockComment } from '@shared/__mocks__/CreateMockComment'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { drawOmikuji, addWeightPercentages } from '@shared/utils/omikuji/DrawOmikuji'
import { OmikujiProcessor } from '@MainScripts/omikujiProcess/OmikujiProcessor'
import { toast } from 'vue-sonner'
import { storeToRefs } from 'pinia'

export function useTestPost() {
  const omikujiStore = useOmikujiStore()
  const { data, selectedCategory, selectedRuleId } = storeToRefs(omikujiStore)

  // 選択されているルールを取得（型安全性を確保）
  const selectedRule = computed((): RuleType | null => {
    if (!selectedRuleId.value) return null

    const ruleData =
      selectedCategory.value === 'comments'
        ? data.value.comments[selectedRuleId.value]
        : selectedCategory.value === 'timers'
          ? data.value.timers[selectedRuleId.value]
          : null

    // readonlyを取り除くためにディープコピー
    return ruleData ? JSON.parse(JSON.stringify(ruleData)) : null
  })

  // テスト投稿の遅延処理を並列実行
  const executeTestPostDelays = async (posts: BotMessage[]): Promise<void> => {
    try {
      const delayPromises = posts.map(
        (post) => new Promise<void>((resolve) => setTimeout(resolve, post.delaySeconds * 1000))
      )
      await Promise.all(delayPromises)
    } catch (error) {
      console.error('メッセージ投稿処理のトースト表示中にエラーが発生しました:', error)
      toast.error('テスト投稿の表示中にエラーが発生しました。')
    }
  }

  // 抽選結果の詳細トーストを表示
  const showOmikujiResultToast = (drawOmikuji: OmikujiItemType, actions: PostActionType[]) => {
    const weight = drawOmikuji.weight || 1
    const weightPercent = (drawOmikuji as any).weightPercent || 0
    const omikujiName = drawOmikuji.name || 'おみくじ'

    const firstMessageAction = actions.find((action) => action.messageContent)
    const messageContent = firstMessageAction?.messageContent || 'メッセージなし'

    toast.success('おみくじ抽選結果', {
      description: `おみくじ: ${omikujiName}\n内容: ${messageContent}\n重み: ${weight}\n確率: ${weightPercent.toFixed(2)}%`,
      duration: 15000,
      style: {
        maxWidth: '400px',
        whiteSpace: 'pre-line',
      },
    })
  }

  const postTestOmikujiItem = (actions: PostActionType[], drawOmikuji?: OmikujiItemType) => {
    const rule = selectedRule.value
    if (!rule) {
      toast.error('テスト投稿の対象となるルールが選択されていません。')
      return
    }

    const scriptManager = new GameScriptManager(data.value as OmikujiDataType)
    const processor = new OmikujiProcessor(data.value as OmikujiDataType, scriptManager)

    const botMessageArray = processor.executeOmikujiProcess(
      MockComment('suika'),
      rule,
      OmikujiItemSchema.parse({ postActions: actions })
    )

    // 抽選結果がある場合はトーストで表示
    if (drawOmikuji) {
      showOmikujiResultToast(drawOmikuji, actions)
    }

    executeTestPostDelays(botMessageArray)
  }

  const postTestOmikuji = (omikujiSet: OmikujiItemType[]) => {
    const omikujisWithPercent = addWeightPercentages(omikujiSet)
    const omikujiItem = drawOmikuji(omikujisWithPercent)

    if (!omikujiItem) {
      toast.error('おみくじ抽選結果', {
        description: '該当するおみくじがありませんでした。',
        duration: 5000,
      })
      return
    }

    postTestOmikujiItem(omikujiItem.postActions, omikujiItem)
  }

  return {
    postTestOmikuji,
    postTestOmikujiItem,
    executeTestPostDelays,
  }
}
