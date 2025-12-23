// src/ConfigMaker/script/useTestPost.ts
import { computed } from 'vue'
import {
  OmikujiItemSchema,
  PostActionType,
  BotMessage,
  OmikujiItemType,
  OmikujiDataType,
  RuleType,
  GameScriptsType,
  isRulesCategory,
} from '@/types/'
import { OmikujiTestProcessor } from './OmikujiTestProcessor'
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
import { GameScriptManager } from '@/MainGenerator/scripts/GameScript/GameScriptManager'
import { drawOmikuji, addWeightPercentages } from '@shared/utils/omikuji/DrawOmikuji'
import { playSound } from '@/Toolkit/sounds'
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { OmikenCommentSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'

export function useTestPost() {
  const omikujiStore = useOmikujiStore()
  const { data, selectedCategory, selectedItemKey } = storeToRefs(omikujiStore)

  // 選択されているルールを取得（型安全性を確保）
  const selectedRule = computed((): RuleType | null => {
    const key = selectedItemKey.value
    if (!key) return null

    if (!isRulesCategory(selectedCategory.value)) return null
    const ruleData = data.value[selectedCategory.value]?.[key]

    return ruleData ? JSON.parse(JSON.stringify(ruleData)) : null
  })

  // テスト投稿の遅延処理を並列実行
  const executeTestPostDelays = async (posts: BotMessage[]): Promise<void> => {
    try {
      const delayPromises = posts.map(
        (post) =>
          new Promise<void>((resolve) => {
            setTimeout(() => {
              // 🎵 sound再生
              if (post.sound) playSound(post.sound)
              resolve()
            }, post.delaySeconds * 1000)
          })
      )

      await Promise.all(delayPromises)
    } catch (error) {
      console.error('メッセージ投稿処理中にエラーが発生しました:', error)

      Swal.fire({
        icon: 'error',
        title: 'テスト投稿の表示中にエラーが発生しました',
        text: '詳細はコンソールをご確認ください。',
      })
    }
  }

  const findFirstMessageBubble = (actions: PostActionType[]): string | null => {
    const action = actions.find(
      (a): a is Extract<PostActionType, { actionType: 'message' }> => a.actionType === 'message' && !!a.message?.bubble
    )

    return action?.message.bubble ?? null
  }

  // 抽選結果の詳細トーストを表示
  const showOmikujiResultToast = (drawOmikuji: OmikujiItemType, actions: PostActionType[]) => {
    const weight = drawOmikuji.weight || 1
    const weightPercent = (drawOmikuji as any).weightPercent || 0
    const omikujiName = drawOmikuji.name || '無名のアイテム'

    const bubble = findFirstMessageBubble(actions) ?? 'メッセージなし'

    Swal.fire({
      toast: true,
      position: 'bottom-end',
      icon: 'success',
      title: 'おみくじ抽選結果',
      html: `
      おみくじ: ${omikujiName}<br>
      内容: ${bubble}<br>
      重み: ${weight}<br>
      確率: ${weightPercent.toFixed(2)}%
    `,
      showConfirmButton: false,
      timer: 15000,
      timerProgressBar: true,
    })
  }

  const postTestOmikujiItem = (
    postActions: PostActionType[],
    gameScripts?: GameScriptsType | null,
    drawOmikuji?: OmikujiItemType
  ) => {
    const rule = selectedRule.value
    const scriptManager = new GameScriptManager()
    const processor = new OmikujiTestProcessor(data.value as OmikujiDataType, scriptManager)

    const mockComment = OmikenCommentSchema.parse({
      userId: 'testUserId',
      userName: 'テストユーザー',
      comment: 'テストコメント',
    })
    let botMessageArray: BotMessage[]

    if (!rule) {
      // ルールがない場合は簡易実行（アクションのみをテスト）
      botMessageArray = processor.executePostActionsOnly(postActions, mockComment)
    } else {
      // ルールがある場合は完全な実行
      let testOmikujiItem: OmikujiItemType

      if (drawOmikuji) {
        testOmikujiItem = drawOmikuji
        testOmikujiItem.postActions = postActions
      } else {
        testOmikujiItem = OmikujiItemSchema.parse({
          postActions,
          gameScripts,
        })
      }

      botMessageArray = processor.executeOmikujiDirect(testOmikujiItem, mockComment)
    }

    if (drawOmikuji) {
      showOmikujiResultToast(drawOmikuji, postActions)
    }
    executeTestPostDelays(botMessageArray)
  }

  const postTestOmikuji = (omikujiSet: OmikujiItemType[]) => {
    const rule = selectedRule.value
    if (!rule) {
      Swal.fire({
        icon: 'error',
        title: 'ルールが選択されていません',
        text: 'テスト投稿の対象となるルールを選択してください。',
      })
      return
    }

    const omikujisWithPercent = addWeightPercentages(omikujiSet)
    const omikujiItem = drawOmikuji(omikujisWithPercent)

    if (!omikujiItem) {
      Swal.fire({
        icon: 'warning',
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
