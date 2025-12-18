// C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\types\OmikujiData\migrations\migratePostAction.ts
import { PostActionType as OldPostActionType } from '@/Toolkit/migrations/v1_to_v2/OmikujiDataV1/OmikujiSchema'
import { PostActionMessageSchema, PostActionSchema, PostActionSoundSchema, PostActionType } from '../OmikujiSchema'
import z from 'zod'

// ---
// マイグレーション用関数

/**
 * 古い PostAction オブジェクトを新しい判別共用体形式 (PostActionSchema) にマイグレーションする。
 * messageContent/messageToast を message.bubble/message.toast に変換し、
 * 古い単一のアクションから複数のアクションが生成される可能性があるため、配列を返します。
 */
export function migratePostAction(oldAction: OldPostActionType): PostActionType[] {
  if (oldAction.messageContent === undefined || oldAction.messageContent === null) {
    const parseResult = PostActionSchema.safeParse(oldAction)
    if (parseResult.success) return [parseResult.data]
  }

  const newActions: PostActionType[] = []

  const baseFields = {
    delaySeconds: oldAction.delaySeconds ?? 0,
  }

  // 1. actionSet の移行 (最優先)
  if (oldAction.actionSetKey && oldAction.actionSetKey.trim() !== '') {
    newActions.push({
      ...baseFields,
      actionType: 'actionSet',
      actionSetKey: oldAction.actionSetKey,
    })
    return newActions
  }

  // 2. message / toast の移行 (新しい 'message' actionTypeに集約)
  const hasMessageOrToast =
    (oldAction.messageContent && oldAction.messageContent.trim() !== '') ||
    (oldAction.messageToast && oldAction.messageToast.trim() !== '')

  if (hasMessageOrToast) {
    newActions.push({
      ...baseFields,
      actionType: 'message',
      characterKey: oldAction.characterKey ?? '',
      iconKey: oldAction.iconKey ?? 'default',
      sound: oldAction.sound as z.infer<typeof PostActionMessageSchema>['sound'],
      message: {
        bubble: oldAction.messageContent, // ★ messageContent -> message.bubble
        toast: oldAction.messageToast, // ★ messageToast -> message.toast
      },
    })
  }

  // 3. wordParty の移行
  if (oldAction.wordParty && oldAction.wordParty.trim() !== '') {
    newActions.push({
      ...baseFields,
      actionType: 'wordParty',
      wordParty: oldAction.wordParty,
    })
  }

  // 4. sound の移行 (messageアクションに統合されなかった場合のみ)
  const isSoundOnly = oldAction.sound && oldAction.sound.trim() !== '' && !hasMessageOrToast
  if (isSoundOnly) {
    newActions.push({
      ...baseFields,
      actionType: 'sound',
      sound: oldAction.sound as z.infer<typeof PostActionSoundSchema>['sound'],
    })
  }

  // 5. フォールバック (何も設定されていなかった場合)
  if (newActions.length === 0) {
    newActions.push({
      ...baseFields,
      actionType: 'message',
      characterKey: oldAction.characterKey ?? '',
      iconKey: oldAction.iconKey ?? 'default',
      sound: oldAction.sound as z.infer<typeof PostActionMessageSchema>['sound'],
      message: {},
    })
  }

  return newActions
}
