// src/MainGenerator/composables/useAppInitializer.ts
import { useAppStore } from '@main/stores/useAppStore'
import { RuleCommentProcessor } from '@main/scripts/RuleProcess/RuleCommentProcessor'
import { generatorApi } from '@/PresetManager/services/generatorApi'
import { GetOmikenComments } from '@shared/sdk/subscribe/OmikenComment/GetOmikenComments'
import { useVisibilityAccess } from '../scripts/FeatureAccess/useAccessCheckerMain'

export function useAppInitializer() {
  const initialize = async () => {
    const appStore = useAppStore()
    const { isComment } = useVisibilityAccess()

    // 初期化開始を明示（status: 'initializing' はストア初期値のため呼び出し不要だが、
    // 再初期化ケースに備えて明示的に設定する）
    appStore.setStatus('initializing')

    try {
      // コメント購読開始（内部で PingOneSDK によるリトライ付き接続確認を実施）
      const isInit = await GetOmikenComments((omikens) => {
        // ユーザー記録
        for (const omiken of omikens) {
          const { lc, tc } = omiken.meta
          const giftPrice = omiken.giftPrice ?? 0
          appStore.userSession.stats.recordComment(omiken, tc, lc, giftPrice)
        }

        // コメント処理
        if (!isComment.value) return

        const commentProcessor = new RuleCommentProcessor()
        const botMessages = commentProcessor.respondToComments(omikens)
        appStore.scheduleBotMessages(botMessages)
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
        if (serverData) appStore.loadData(serverData)
      }

      // ready へ
      appStore.setStatus('ready')
    } catch (error) {
      console.error('❌ 初期化エラー:', error)
      appStore.setStatus('error')
    }
  }

  return { initialize }
}
