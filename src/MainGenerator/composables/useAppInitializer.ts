// src/MainGenerator/composables/useAppInitializer.ts
import { useRuleProcessor } from '@/MainGenerator/composables/useRuleProcessor'
import { RuleCommentProcessor } from '@main/scripts/RuleProcess/RuleCommentProcessor'
import { generatorApi } from '@config/dev/services/generatorApi'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'

import { ComputedRef } from 'vue'
import { useAppStore } from '../stores/useAppStore'

export function useAppInitializer(isComment: ComputedRef<boolean>) {
  const initialize = async () => {
    const appStore = useAppStore()
    const ruleProcessor = useRuleProcessor(appStore.data)

    const isInit = await ruleProcessor.initializeApp((omikens) => {
      // ユーザー情報を記録
      for (const omiken of omikens) {
        appStore.userVisitManager.recordLiveComment(UserNameSchema.parse(omiken))
      }

      // おみくじ処理
      if (!isComment.value) return
      const commentProcessor = new RuleCommentProcessor()
      const botMessages = commentProcessor.respondToComments(omikens)
      appStore.scheduleBotMessages(botMessages)
    })

    appStore.setInitialized(isInit)

    // サーバ同期
    if (isInit) {
      const isHealth = await generatorApi.getHealth()
      if (!isHealth) return

      const serverData = await generatorApi.loadGeneratorConfig()
      if (serverData) {
        appStore.loadData(serverData)
      }
    }
  }

  return { initialize }
}
