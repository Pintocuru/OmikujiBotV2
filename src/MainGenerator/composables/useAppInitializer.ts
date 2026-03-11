// src/MainGenerator/composables/useAppInitializer.ts
import { useAppStore } from '@main/stores/useAppStore'
import { EventCommentProcessor } from '@/MainGenerator/scripts/EventProcess/CommentProcessor'
import { generatorApi } from '@/PresetManager/services/generatorApi'
import { GetOmikenComments } from '@shared/sdk/subscribe/OmikenComment/GetOmikenComments'
import { useVisibilityAccess } from '../scripts/FeatureAccess/useAccessCheckerMain'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'
import { useNavigationStore } from '@/ConfigMaker/stores/useNavigationStore'
import { storeToRefs } from 'pinia'
import { POST_SETTINGS } from '@shared/sdk/PostSettings'

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
      const isInit = await GetOmikenComments((omikens, isReset) => {
        try {
          // リセット検出
          if (isReset) {
            appStore.clearOmikens()
            appStore.streamStats.reset()
            appStore.userSession.resetSession()
            return
          }

          const pattern = data.value.settings.ignoreUserPattern

          // ① 重複排除: 新規コメントのみ取得（責務はここに集約）
          const newOmikens = appStore.addOmikens(omikens)

          for (const omiken of newOmikens) {
            // 除外判定
            if (isBotComment(omiken.userId)) continue
            if (shouldIgnoreUser(omiken.userName, pattern)) continue

            const status = appStore.metaState.getCurrent()
            appStore.streamStats.record(omiken, status)
            appStore.userSession.stats.recordComment(omiken)
          }

          // コメントイベント処理
          if (!isComment.value) return
          const commentProcessor = new EventCommentProcessor()
          const botMessages = commentProcessor.respondToComments(newOmikens)
          appStore.scheduleBotMessages(botMessages)
        } catch (error) {
          console.error('[useAppInitializer] コメント処理エラー:', error)
          postSystemMessage(`コメント処理エラー: ${error}`, { speech: false, throttle: true })
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

/**
 * ユーザー記録を除外するかどうかを判定する
 */
const shouldIgnoreUser = (userName: string, pattern: string): boolean => {
  if (!pattern || !userName) return false

  try {
    const regex = new RegExp(pattern, 'i')
    return regex.test(userName)
  } catch (e) {
    console.warn('ignoreUserPattern の正規表現が不正です:', e)
    return false
  }
}

const isBotComment = (userId: string): boolean => {
  return userId === POST_SETTINGS.botUserId
}
