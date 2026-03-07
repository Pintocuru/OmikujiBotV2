// src/MainGenerator/composables/useAppInitializer.ts
import { useAppStore } from '@main/stores/useAppStore'
import { EventCommentProcessor } from '@/MainGenerator/scripts/EventProcess/CommentProcessor'
import { generatorApi } from '@/PresetManager/services/generatorApi'
import { GetOmikenComments } from '@shared/sdk/subscribe/OmikenComment/GetOmikenComments'
import { useVisibilityAccess } from '../scripts/FeatureAccess/useAccessCheckerMain'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'
import { useNavigationStore } from '@/ConfigMaker/stores/useNavigationStore'
import { shouldIgnoreUser } from '@/common/filters/shouldIgnoreUser'
import { storeToRefs } from 'pinia'

export function useAppInitializer() {
  const initialize = async () => {
    const appStore = useAppStore()
    const { data } = storeToRefs(appStore)
    const navigationStore = useNavigationStore()
    const { isComment } = useVisibilityAccess()

    // 初期化開始を明示（status: 'initializing' はストア初期値のため呼び出し不要だが、
    // 再初期化ケースに備えて明示的に設定する）
    appStore.setStatus('initializing')

    try {
      // コメント購読
      const isInit = await GetOmikenComments((omikens) => {
        try {
          const pattern = data.value.settings.ignoreUserPattern
          // ユーザー記録
          for (const omiken of omikens) {
            // ユーザー記録を除外するか
            if (shouldIgnoreUser(omiken.userName, pattern)) continue

            const { lc, tc } = omiken.meta
            const giftPrice = omiken.giftPrice ?? 0
            appStore.userSession.stats.recordComment(omiken, tc, lc, giftPrice)
          }

          // コメント処理
          if (!isComment.value) return

          const commentProcessor = new EventCommentProcessor()
          const botMessages = commentProcessor.respondToComments(omikens)
          appStore.scheduleBotMessages(botMessages)
        } catch (error) {
          // コメント処理中のエラーはアプリを止めず、ログのみ
          // （次のコメントで回復できる可能性があるため）
          console.error('[useAppInitializer] コメント処理エラー:', error)
          postSystemMessage(`コメント処理エラー: ${error}`, {
            speech: false,
            throttle: true,
          })
        }
      })

      // PingOneSDK のリトライが全て失敗した場合のみ error に遷移
      if (!isInit) {
        appStore.setStatus('error')
        return
      }

      // サーバ同期(オプション)
      const isHealth = await generatorApi.getHealth()
      if (isHealth) {
        const serverData = await generatorApi.loadGeneratorConfig()
        if (serverData) {
          appStore.loadData(serverData)
          navigationStore.selectCategory(appStore.data.settings.initialCategory)
          const name = appStore.data.meta.name
          postSystemMessage(`エディタープラグイン から ${name} のデータを読み込みました`, {
            username: '__INFO__',
            speech: false,
          })
        }
      }

      // ready へ
      appStore.setStatus('ready')
    } catch (error) {
      console.error('❌ 初期化エラー:', error)
      appStore.setError(error instanceof Error ? error.message : String(error))
      postSystemMessage(`❌ 初期化エラー: ${error}`)
    }
  }

  return { initialize }
}
