// src/MainGenerator/components/OmikujiBot/usePersistentCharacterDisplay.ts
import { ref, computed, Ref, watch } from 'vue'
import { BotMessage } from '@/types/'
import { useBotDisplayBase } from './useBotDisplayBase'

// キャラクター常時表示対応版composable
export const usePersistentCharacterDisplay = (
  botMessages: Ref<BotMessage[]>,
  persistentCharacter: Ref<boolean> = ref(false)
) => {
  const persistentCharacterData = ref<BotMessage | null>(null)

  // 基底composableを使用（コメント用に固定）
  const baseDisplay = useBotDisplayBase(botMessages, 'comment')

  // 元のremoveCommentを拡張
  const removeComment = (messageId: string) => {
    const comment = baseDisplay.displayedComments.value.find((item) => item.id === messageId)

    // 常時表示モードの場合、最後のキャラクターデータを保持
    if (persistentCharacter.value && comment?.profileImage) {
      persistentCharacterData.value = comment
    }

    // 基底のremoveCommentを実行
    baseDisplay.removeComment(messageId)
  }

  // 常時表示用のキャラクターデータを取得
  const getCurrentCharacter = computed(() => {
    if (!persistentCharacter.value) return null

    // 現在表示中のコメントがある場合はそれを優先
    const currentComment = baseDisplay.displayedComments.value.find(
      (comment) => comment.visible && comment.profileImage
    )

    if (currentComment) return currentComment

    // 表示中のコメントがない場合は最後のキャラクターデータを使用
    return persistentCharacterData.value
  })

  // 常時表示モードの変更を監視
  watch(persistentCharacter, (newValue) => {
    if (!newValue) {
      // 常時表示をOFFにした場合、保持データをクリア
      persistentCharacterData.value = null
    }
  })

  // startをオーバーライドして常時表示データの管理を追加
  const start = () => {
    // 常時表示モードでない場合は保持データもクリア
    if (!persistentCharacter.value) {
      persistentCharacterData.value = null
    }
    baseDisplay.start()
  }

  return {
    displayedComments: baseDisplay.displayedComments,
    getCurrentCharacter,
    persistentCharacterData,
    handleImageError: baseDisplay.handleImageError,
    removeComment,
    hideComment: baseDisplay.hideComment,
    start,
    stop: baseDisplay.stop,
  }
}
