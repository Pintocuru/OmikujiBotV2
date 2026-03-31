// src/ConfigMaker/scripts/useTestPost.ts
import { computed } from 'vue'
import {
  PostFlowType,
  BotMessageType,
  OmikujiItemType,
  EventType,
  GameScriptsType,
  isRulesCategory,
  ActionSetType,
  ActionSetSchema,
  defaultPlaceholdersShortLabels,
} from '@/types/'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { drawOmikuji, addWeightPercentages } from '@shared/utils/omikuji/DrawOmikuji'
import { storeToRefs } from 'pinia'
import { OmikenCommentSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { useNavigationStore } from '../stores/useNavigationStore'
import { useGetRecordData } from '../stores/useGetRecordData'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
import { PlaceholderVariable } from '@main/stores/PlaceholderVariable/PlaceholderVariable'
import { OmikujiResultProcessor } from '@main/scripts/OmikujiResult/OmikujiResultProcessor'

const MOCK_COMMENT = OmikenCommentSchema.parse({
  userId: 'testUserId',
  userName: 'テストユーザー',
  comment: 'テストコメント',
})

export function useTestPost() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { getItem } = useGetRecordData()
  const navigationStore = useNavigationStore()
  const { selectedCategory, selectedItemKey } = storeToRefs(navigationStore)

  const scriptManager = GameScriptManager.getInstance()
  const placeholderVariable = new PlaceholderVariable()

  // 選択されているイベントを取得（型安全性を確保）
  const selectedRule = computed((): EventType | null => {
    const key = selectedItemKey.value
    if (!key || !isRulesCategory(selectedCategory.value)) return null
    return getItem(selectedCategory.value, key) ?? null
  })

  // 抽選結果の詳細トーストを表示
  const showOmikujiResultToast = (omikujiItem: OmikujiItemType) => {
    swalToast.success({
      title: 'おみくじ抽選結果',
      html: `おみくじ: ${omikujiItem.name || '無名のアイテム'}<br>重み: ${omikujiItem.weight || 1}`,
      timer: 15000,
    })
  }

  const postTestOmikujiItem = async (
    postActions: PostFlowType[],
    gameScripts?: GameScriptsType | null,
    omikujiItem?: OmikujiItemType
  ) => {
    const resultProcessor = new OmikujiResultProcessor(data.value, scriptManager.playScript, placeholderVariable)

    const actionItem: ActionSetType = omikujiItem
      ? { ...omikujiItem, postActions }
      : ActionSetSchema.parse({ postActions, gameScripts })

    const processItem = selectedRule.value ? actionItem : ActionSetSchema.parse({ postActions })

    const botMessages = await resultProcessor.process(processItem, defaultPlaceholdersShortLabels, MOCK_COMMENT)

    if (omikujiItem) showOmikujiResultToast(omikujiItem)
    executeTestPostDelays(botMessages)
  }

  const postTestOmikuji = (omikujiSet: OmikujiItemType[]) => {
    if (!selectedRule.value) {
      swalToast.error({
        title: 'イベントが選択されていません',
        text: 'テスト投稿の対象となるイベントを選択してください。',
      })
      return
    }

    const priorityItems = omikujiSet.filter((item) => !item.isPriority)
    const targetSet = priorityItems.length > 0 ? priorityItems : omikujiSet
    const omikujiItem = drawOmikuji(addWeightPercentages(targetSet))

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
  }
}

// テスト投稿の遅延処理を並列実行
const executeTestPostDelays = async (posts: BotMessageType[]): Promise<void> => {
  try {
    await Promise.all(
      posts.map((post) => new Promise<void>((resolve) => setTimeout(resolve, post.delaySeconds * 1000)))
    )
  } catch (error) {
    console.error('メッセージ投稿処理中にエラーが発生しました:', error)
    swalModal.error({
      title: 'テスト投稿の表示中にエラーが発生しました',
      text: String(error),
    })
  }
}
