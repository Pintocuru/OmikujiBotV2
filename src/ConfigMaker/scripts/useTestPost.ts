// src/ConfigMaker/scripts/useTestPost.ts
import { computed } from 'vue'
import {
  PostFlowType,
  BotMessageType,
  OmikujiItemType,
  RuleType,
  GameScriptsType,
  isRulesCategory,
  ActionSetType,
  ActionSetSchema,
} from '@/types/'
import { OmikujiTestProcessor } from './OmikujiTestProcessor'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { drawOmikuji, addWeightPercentages } from '@shared/utils/omikuji/DrawOmikuji'
import { storeToRefs } from 'pinia'
import { OmikenCommentSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { useNavigationStore } from '../stores/useNavigationStore'
import { useGetRecordData } from '../stores/useGetRecordData'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

export function useTestPost() {
  const { getItem } = useGetRecordData()
  const navigationStore = useNavigationStore()
  const { selectedCategory, selectedItemKey } = storeToRefs(navigationStore)

  // 選択されているルールを取得（型安全性を確保）
  const selectedRule = computed((): RuleType | null => {
    const key = selectedItemKey.value
    if (!key) return null

    if (!isRulesCategory(selectedCategory.value)) return null
    const ruleData = getItem(selectedCategory.value, key)

    return ruleData ? ruleData : null
  })

  // テスト投稿の遅延処理を並列実行
  const executeTestPostDelays = async (posts: BotMessageType[]): Promise<void> => {
    try {
      const delayPromises = posts.map(
        (post) =>
          new Promise<void>((resolve) => {
            setTimeout(() => {
              resolve()
            }, post.delaySeconds * 1000)
          })
      )

      await Promise.all(delayPromises)
    } catch (error) {
      console.error('メッセージ投稿処理中にエラーが発生しました:', error)

      swalModal.error({
        title: 'テスト投稿の表示中にエラーが発生しました',
        text: String(error),
      })
    }
  }

  // 抽選結果の詳細トーストを表示
  const showOmikujiResultToast = (drawOmikuji: OmikujiItemType) => {
    const weight = drawOmikuji.weight || 1
    const omikujiName = drawOmikuji.name || '無名のアイテム'

    swalToast.success({
      title: 'おみくじ抽選結果',
      html: `おみくじ: ${omikujiName}<br>重み: ${weight}<br>`,
      timer: 15000,
    })
  }

  const postTestOmikujiItem = (
    postActions: PostFlowType[],
    gameScripts?: GameScriptsType | null,
    drawOmikuji?: OmikujiItemType
  ) => {
    const omikujiStore = useOmikujiStore()

    const rule = selectedRule.value
    const scriptManager = GameScriptManager.getInstance()
    const processor = new OmikujiTestProcessor(omikujiStore.data, scriptManager)

    const mockComment = OmikenCommentSchema.parse({
      userId: 'testUserId',
      userName: 'テストユーザー',
      comment: 'テストコメント',
    })
    let botMessageArray: BotMessageType[]

    if (!rule) {
      // ルールがない場合は簡易実行（アクションのみをテスト）
      botMessageArray = processor.executePostActionsOnly(postActions, mockComment)
    } else {
      // ルールがある場合は完全な実行
      let testActionItem: ActionSetType

      if (drawOmikuji) {
        testActionItem = drawOmikuji
        testActionItem.postActions = postActions
      } else {
        testActionItem = ActionSetSchema.parse({
          postActions,
          gameScripts,
        })
      }

      botMessageArray = processor.executeOmikujiDirect(testActionItem, mockComment)
    }

    if (drawOmikuji) {
      showOmikujiResultToast(drawOmikuji)
    }
    executeTestPostDelays(botMessageArray)
  }

  const postTestOmikuji = (omikujiSet: OmikujiItemType[]) => {
    const rule = selectedRule.value
    if (!rule) {
      swalToast.error({
        title: 'ルールが選択されていません',
        text: 'テスト投稿の対象となるルールを選択してください。',
      })
      return
    }

    const priorityItems = omikujiSet.filter((item) => !item.isPriority)
    const targetSet = priorityItems.length > 0 ? priorityItems : omikujiSet
    const omikujisWithPercent = addWeightPercentages(targetSet)
    const omikujiItem = drawOmikuji(omikujisWithPercent)

    if (!omikujiItem) {
      swalToast.info({
        title: 'おみくじ抽選結果',
        text: '該当するおみくじがありませんでした。',
      })
      return
    }

    postTestOmikujiItem(omikujiItem.postActions, omikujiItem.gameScripts, omikujiItem)
  }

  return {
    postTestOmikuji,
    postTestOmikujiItem,
    executeTestPostDelays,
  }
}
