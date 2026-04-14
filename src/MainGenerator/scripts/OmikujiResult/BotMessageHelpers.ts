// src/MainGenerator/scripts/OmikujiResult/BotMessageHelpers.ts
import {
  BotMessageBubbleSchema,
  BotMessageExtraSchema,
  BotMessageExtraType,
  BotMessageType,
  ExtraSlotsType,
} from '@/types/MainGenerator/BotMessageSchema'
import { PostFlowMessageType } from '@/types/OmikujiData/'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { VariablePlaceholderExtra } from '@/types/MainGenerator/OmikujiResultTypes'
import { CharacterManager } from '../CharacterManager/CharacterManager'
import { playRpgVoiceLoop } from '@/common/sounds'

/**
 * PostActionからBotMessageを生成
 */
export function createBotMessagesFromAction(
  action: PostFlowMessageType,
  extra: VariablePlaceholderExtra | undefined,
  delaySeconds: number,
  characterManager?: CharacterManager,
  omiken?: OmikenCommentType
): BotMessageType[] {
  const bubble = action.message.bubble || ''
  const isToast = action.message.isToast
  const hasRanking = !!extra?.scriptKey && (!!extra?.lists || !!extra?.slots)

  const messages: BotMessageType[] = []

  const bubbleMessage = createBubbleMessage(
    action.characterKey,
    action.iconKey,
    bubble,
    isToast,
    delaySeconds,
    characterManager,
    extra?.slots
  )
  messages.push(bubbleMessage)

  // RPG音声再生
  if (!isToast) {
    playRpgVoiceForCharacter(action.characterKey, bubble, delaySeconds, characterManager)
  }

  // Rankingメッセージ
  if (hasRanking) messages.push(createRankingMessage(delaySeconds, extra, omiken))

  return messages
}

/**
 * PostFlowVariable からBotMessageを生成
 */
export function createBotMessagesFromVariable(
  extra: VariablePlaceholderExtra | undefined,
  delaySeconds: number,
  omiken?: OmikenCommentType
): BotMessageType[] {
  const hasRanking = extra?.scriptKey && (extra.lists || extra.slots)
  return hasRanking ? [createRankingMessage(delaySeconds, extra, omiken)] : []
}

/**
 * Bubbleメッセージを生成
 */
function createBubbleMessage(
  characterKey: string | null,
  iconKey: string,
  message: string,
  isToast: boolean | undefined,
  delaySeconds: number,
  characterManager?: CharacterManager,
  slots?: ExtraSlotsType
): BotMessageType {
  const resolved = characterManager?.resolveCharacter({ characterKey, iconKey })
  const character = resolved && characterManager?.getCharacter(resolved.characterKey)

  return BotMessageBubbleSchema.parse({
    delaySeconds,
    bubble: {
      name: character?.displayName || '',
      message,
      isToast,
      characterKey: resolved?.characterKey,
      iconKey: resolved?.iconKey,
    },
    slots,
  })
}

/**
 * Rankingメッセージを生成
 */
function createRankingMessage(
  delaySeconds: number,
  extra: VariablePlaceholderExtra,
  omiken?: OmikenCommentType
): BotMessageExtraType {
  return BotMessageExtraSchema.parse({
    delaySeconds,
    scriptKey: extra.scriptKey,
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
