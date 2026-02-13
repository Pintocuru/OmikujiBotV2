// src/MainGenerator/composables/useAppInitializer.ts
import { ComputedRef } from 'vue'
import { useAppStore } from '@main/stores/useAppStore'
import { RuleCommentProcessor } from '@main/scripts/RuleProcess/RuleCommentProcessor'
import { generatorApi } from '@config/dev/services/generatorApi'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { GetOmikenComments } from '@shared/sdk/subscribe/OmikenComment/GetOmikenComments'

export function useAppInitializer(isComment: ComputedRef<boolean>) {
  const initialize = async () => {
    const appStore = useAppStore()

    try {
      // コメント購読開始
      const isInit = await GetOmikenComments((omikens) => {
        // ユーザー記録
        for (const omiken of omikens) {
          appStore.userVisitManager.recordLiveComment(UserNameSchema.parse(omiken))
        }

        // コメント処理
        if (!isComment.value) return

        const commentProcessor = new RuleCommentProcessor()
        const botMessages = commentProcessor.respondToComments(omikens)
        appStore.scheduleBotMessages(botMessages)
      })

      appStore.setInitialized(isInit)

      if (!isInit) return

      // サーバ同期
      const isHealth = await generatorApi.getHealth()
      if (!isHealth) return

      const serverData = await generatorApi.loadGeneratorConfig()
      if (serverData) {
        appStore.loadData(serverData)
      }
    } catch (error) {
      console.error('❌ 初期化エラー:', error)
      appStore.setInitialized(false)
    }
  }

  return { initialize }
}
