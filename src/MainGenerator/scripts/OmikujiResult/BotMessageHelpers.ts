// src/MainGenerator/scripts/OmikujiResult/BotMessageHelpers.ts
import { BotMessageBubbleSchema, BotMessageExtraSchema, BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { CharacterEmotionType, PostFlowMessageType } from '@/types/OmikujiData/'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { VariablePlaceholderExtra, VariablePlaceholderResult } from '@/types/MainGenerator/OmikujiResultTypes'
import { CharacterManager } from '../CharacterManager/CharacterManager'
import { playRpgVoiceLoop } from '@/common/sounds'

/**
 * PostActionからBotMessageを生成
 */
export function createBotMessagesFromAction(
  action: PostFlowMessageType,
  variableResult: VariablePlaceholderResult | undefined,
  delaySeconds: number,
  characterManager?: CharacterManager,
  omiken?: OmikenCommentType
): BotMessageType[] {
  const bubble = action.message.bubble || ''
  const isToast = action.message.isToast
  const hasBubble = bubble.trim().length > 0

  const extra = variableResult?.extra
  const hasRanking = !!extra?.componentKey && (!!extra?.lists || !!extra?.slots)

  const messages: BotMessageType[] = []

  // Bubbleメッセージ
  if (hasBubble) {
    const bubbleMessage = createBubbleMessage(
      action.characterKey,
      action.iconKey,
      bubble,
      isToast,
      delaySeconds,
      characterManager
    )
    messages.push(bubbleMessage)

    // RPG音声再生
    if (!isToast) {
      playRpgVoiceForCharacter(action.characterKey, bubble, delaySeconds, characterManager)
    }
  }

  // Rankingメッセージ
  if (hasRanking) messages.push(createRankingMessage(delaySeconds, extra, omiken))

  return messages
}

/**
 * Bubbleメッセージを生成
 */
function createBubbleMessage(
  characterKey: string | null,
  iconKey: CharacterEmotionType,
  bubble: string,
  isToast: boolean | undefined,
  delaySeconds: number,
  characterManager?: CharacterManager
): BotMessageType {
  const resolved = characterManager?.resolveCharacter({ characterKey, iconKey })
  const character = resolved && characterManager?.getCharacter(resolved.characterKey)

  return BotMessageBubbleSchema.parse({
    delaySeconds,
    bubble: {
      name: character?.displayName || '',
      message: bubble,
      isToast,
      characterKey: resolved?.characterKey,
      iconKey: resolved?.iconKey,
    },
  })
}

/**
 * Rankingメッセージを生成
 */
function createRankingMessage(
  delaySeconds: number,
  extra: VariablePlaceholderExtra,
  omiken?: OmikenCommentType
): BotMessageType {
  return BotMessageExtraSchema.parse({
    delaySeconds,
    componentKey: extra.componentKey,
    lists: extra.lists,
    slots: extra.slots,
    user: omiken ? UserNameSchema.parse(omiken) : undefined,
  })
}

/**
 * キャラクターのRPG音声を再生
 */
function playRpgVoiceForCharacter(
  characterKey: string | null,
  bubble: string,
  delaySeconds: number,
  characterManager?: CharacterManager
): void {
  if (!characterManager) return

  const character = characterManager.getCharacter(characterKey)
  const displayOption = character ? character.displayOption : characterManager.getCharacterDefaultVoice()

  if (displayOption?.mode === 'rpgVoice' && displayOption.rpgVoice) {
    playRpgVoiceLoop(bubble, displayOption.rpgVoice, delaySeconds)
  }
}
