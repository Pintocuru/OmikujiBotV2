// src/MainGenerator/composables/useAppInitializer.ts
import { EventCommentProcessor } from '@main/scripts/EventProcess/CommentProcessor'
import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
import { useAppStore } from '@main/stores/useAppStore'
import { generatorApi } from '@/PresetManager/services/generatorApi'
import { GetOmikenComments } from '@shared/sdk/subscribe/OmikenComment/GetOmikenComments'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'
import { OmikenCommentType } from '@shared/types'
import { POST_SETTINGS } from '@shared/sdk/PostSettings'

const TIME_THRESHOLD = 10000

export function useAppInitializer() {
  const appStore = useAppStore()
  const { isComment } = useVisibilityAccess()

  const initialize = async () => {
    const { setStatus, setError } = useAppStore()
    const commentProcessor = new EventCommentProcessor()
    setStatus('initializing')

    try {
      const isInit = await GetOmikenComments((omikens, isReset, isFirstLoad) => {
        try {
          // リセット検出
          if (isReset) {
            resetAppState()
            return
          }

          // 新規コメントを記録
          const newOmikens = filterNewOmikens(omikens)
          appStore.addOmikens(newOmikens)

          // 投稿から10秒以内のものだけ、下記の処理を行う
          const recentOmikens = isFirstLoad
            ? newOmikens // 初回だけ recent フィルタを無視
            : newOmikens.filter((o) => Date.now() - o.timestamp < TIME_THRESHOLD)

          // 新規コメントからユーザーデータを記録
          recordStats(recentOmikens)

          // コメントイベント
          if (!isComment.value) return
          commentProcessor.respondToComments(recentOmikens)
        } catch (error) {
          console.error('[useAppInitializer] コメント処理エラー:', error)
          postSystemMessage(`コメント処理エラー: ${error}`, { speech: false, throttle: true })
        }
      })

      if (!isInit) {
        setStatus('error')
      } else {
        // エディタープラグインからデータを読み込む
        await syncWithServer()
        setStatus('ready')
      }
    } catch (error) {
      console.error('❌ 初期化エラー:', error)
      setError(error instanceof Error ? error.message : String(error))
      postSystemMessage(`❌ 初期化エラー: ${error}`)
    }
  }

  return { initialize }
}

// リセット検出
function resetAppState() {
  const appStore = useAppStore()
  appStore.clearOmikens()
  appStore.streamStats.reset()
  appStore.userSession.resetSession()
}

// コメントをフィルター
function filterNewOmikens(omikens: OmikenCommentType[]): OmikenCommentType[] {
  const appStore = useAppStore()
  const ignorePattern = appStore.data.settings.ignoreUserPattern
  const currentMeta = appStore.serviceMetaStore.getCurrent()
  const includeExternalComments = appStore.data.settings.includeExternalComments ?? false
  return omikens.filter((omiken) => {
    if (ignoreOmikujiBot(omiken.userId)) return false
    if (!includeExternalComments && ignoreExternalOnLive(omiken.meta.isExternal, currentMeta?.isLive)) return false
    if (ignoreNamePattern(omiken.userName, ignorePattern)) return false
    return true
  })
}

// 新規コメントからユーザーデータを記録
function recordStats(omikens: OmikenCommentType[]) {
  const appStore = useAppStore()
  for (const omiken of omikens) {
    appStore.streamStats.record(omiken)
    appStore.userSession.stats.recordComment(omiken)
  }
}

// エディタープラグインからデータを読み込む
async function syncWithServer() {
  const appStore = useAppStore()
  try {
    const serverData = await generatorApi.loadGeneratorConfig()
    if (!serverData) return

    appStore.loadData(serverData)
    postSystemMessage(`エディタープラグイン から ${appStore.data.meta.name} のデータを読み込みました`, {
      username: '__INFO__',
      speech: false,
    })
  } catch (err) {
    const msg = `エディタープラグインからデータ読み込みに失敗しました: ${err}`
    console.error(msg)
    postSystemMessage(msg)
  }
}

// OmikujiBotのコメントなら必ず弾く
const ignoreOmikujiBot = (userId: string): boolean => {
  return userId === POST_SETTINGS.botUserId
}

// 配信中は外部コメントをシャットアウトする
const ignoreExternalOnLive = (isExternalComment: boolean, isLive?: boolean): boolean => {
  if (isLive === undefined) return false // undefinedなら配信中ではないと思う
  return isExternalComment && isLive
}

// 配信者などの名前があるなら実行させない
const ignoreNamePattern = (userName: string, pattern: string): boolean => {
  if (!pattern || !userName) return false
  try {
    return new RegExp(pattern, 'i').test(userName)
  } catch (e) {
    console.warn('ignoreUserPattern の正規表現が不正です:', e)
    return false
  }
}
