// src\MainGenerator\scripts\BotMessage\BotMessageGenerator.ts
import { BotMessageType, BotMessageSchema } from '@/types/MainGenerator/BotMessageSchema'
import {
  PostActionType,
  PostActionMessageType,
  PostActionSoundType,
  CharacterColorType,
  CharacterType,
  OmikujiDataType,
  RankingMessageSchema,
} from '@/types/OmikujiData/'
import { playSoundDelay, playRpgVoiceLoop } from '@sounds/PlaySound'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { resolveSettingMode } from '@/common/FeatureAccess/SettingMode'
import { hasAccessPure } from '@/common/FeatureAccess/useAccessChecker'
import { OmikenCommentType, UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { ExpressionEvaluator } from '@main/scripts/VariablePlaceholder/ExpressionEvaluator'

export class BotMessageGenerator {
  private characterMap: Map<string, CharacterType>
  private isCharacterMode: boolean
  private defaultColors: { bubble: CharacterColorType; toast: CharacterColorType }
  private variableProcessor: VariablePlaceholderProcessor
  private evaluator: ExpressionEvaluator

  constructor(omikujiData: OmikujiDataType) {
    this.characterMap = new Map(Object.values(omikujiData.characters).map((char) => [char.key, char]))
    this.isCharacterMode = checkIsCharacter(omikujiData)
    this.defaultColors = {
      bubble: omikujiData.components.bubble.defaultColor,
      toast: omikujiData.components.toast.defaultColor,
    }
    this.evaluator = new ExpressionEvaluator()
    this.variableProcessor = new VariablePlaceholderProcessor(this.evaluator)
  }

  /**
   * 複数のPostActionからBotMessageの配列を生成
   */
  generateMessages(postActions: PostActionType[], omiken?: OmikenCommentType): BotMessageType[] {
    const messages: BotMessageType[] = []
    // TODO: UserNameSchema のデータを作成するのは、この箇所でもいいのでは？

    for (const action of postActions) {
      switch (action.actionType) {
        case 'message':
          messages.push(...this.generateMessageAction(action, omiken))
          break
        case 'sound':
          this.handleSoundAction(action)
          break
        case 'wordParty':
        case 'actionSet':
          // 別処理系でハンドリング
          break
        default:
          const _exhaustiveCheck: never = action
          console.warn('Unknown action type:', _exhaustiveCheck)
      }
    }

    return messages
  }

  /**
   * PostActionMessageType の処理
   */
  private generateMessageAction(postAction: PostActionMessageType, omiken?: OmikenCommentType): BotMessageType[] {
    const character = this.getSafeCharacter(postAction.characterKey)
    const delaySeconds = this.calculateBaseDelay(postAction)
    const { message: msg } = postAction
    const messages: BotMessageType[] = []

    // bubble と toast に対して変数プレースホルダーを適用
    const bubbleResult = msg.bubble ? this.variableProcessor.process(msg.bubble) : null
    const toastResult = msg.toast ? this.variableProcessor.process(msg.toast) : null

    // 最終的なメッセージテキスト
    const finalBubble = bubbleResult?.bubble || null
    const finalToast = toastResult?.bubble || null

    // ランキング情報の生成（textがあれば）
    const rankingSource = bubbleResult || toastResult
    const ranking = rankingSource?.text
      ? RankingMessageSchema.parse({
          scriptKey: 'basicList',
          listName: rankingSource.name,
          scoreText: rankingSource.text,
          symbol: rankingSource.symbol,
          variant: rankingSource.variant,
          isUniqueUser: rankingSource.unique === 'false' ? false : true,
        })
      : undefined

    // メッセージ内容の有無チェック
    const hasBubble = this.hasContent(finalBubble)
    const hasToast = this.hasContent(finalToast)
    const hasRanking = !!ranking

    // 何もメッセージがない場合は音声のみ再生
    if (!hasBubble && !hasToast && !hasRanking) {
      this.playSoundIfExists(postAction.sound, delaySeconds)
      return messages
    }

    // bubble メッセージ処理
    if (hasBubble) {
      messages.push(this.createBotMessage(postAction, character, delaySeconds, 'bubble', finalBubble!, ranking, omiken))
      this.handleRpgVoiceIfNeeded(character, finalBubble!, delaySeconds)
    }
    // toast メッセージ処理
    else if (hasToast) {
      messages.push(this.createBotMessage(postAction, character, delaySeconds, 'toast', finalToast!, ranking, omiken))
    }
    // ranking のみの場合
    else if (hasRanking) {
      messages.push(
        BotMessageSchema.parse({
          delaySeconds,
          type: 'rankingOnly',
          ranking,
          user: omiken ? UserNameSchema.parse(omiken) : undefined,
        })
      )
    }

    // 音声再生
    this.playSoundIfExists(postAction.sound, delaySeconds)

    return messages
  }

  /**
   * PostActionSoundType の処理
   */
  private handleSoundAction(postAction: PostActionSoundType): void {
    const delaySeconds = this.calculateBaseDelay(postAction)
    this.playSoundIfExists(postAction.sound, delaySeconds)
  }

  /**
   * BotMessageオブジェクトを作成
   */
  private createBotMessage(
    postAction: PostActionMessageType,
    character: CharacterType | null,
    delaySeconds: number,
    messageType: 'bubble' | 'toast',
    messageText: string,
    ranking: ReturnType<typeof RankingMessageSchema.parse> | undefined,
    omiken?: OmikenCommentType
  ): BotMessageType {
    const isChar = this.isCharacterMode && character
    const color = isChar ? character.color : this.defaultColors[messageType]

    return BotMessageSchema.parse({
      type: omiken ? 'comment' : 'system',
      delaySeconds,
      user: omiken ? UserNameSchema.parse(omiken) : undefined,
      ranking,
      bubble: {
        name: isChar ? character.displayName : '',
        message: messageType === 'bubble' ? messageText : '',
        toast: messageType === 'toast' ? messageText : undefined,
        isToast: messageType === 'toast',
        characterKey: isChar ? postAction.characterKey : null,
        iconKey: postAction.iconKey,
        color,
      },
    })
  }

  /**
   * RPG風の音声ループを再生(条件に応じて)
   */
  private handleRpgVoiceIfNeeded(character: CharacterType | null, bubble: string, baseDelaySeconds: number): void {
    if (!character?.displayOption) return

    const { mode, rpgVoice } = character.displayOption
    if (mode === 'rpgVoice' && rpgVoice) {
      playRpgVoiceLoop(bubble, rpgVoice, baseDelaySeconds)
    }
  }

  /**
   * 音声を再生(存在する場合のみ)
   */
  private playSoundIfExists(sound: string | undefined, delaySeconds: number): void {
    if (sound?.trim()) {
      playSoundDelay(sound, delaySeconds)
    }
  }

  /**
   * コンテンツの有無チェック
   */
  private hasContent(content: string | null | undefined): boolean {
    return !!content?.trim()
  }

  /**
   * 基本遅延時間を計算
   */
  private calculateBaseDelay(postAction: PostActionType): number {
    return postAction.delaySeconds + POST_SETTINGS.basicDelaySeconds
  }

  /**
   * キャラクター取得(Map使用で高速化)
   */
  private getSafeCharacter(characterKey: string): CharacterType | null {
    try {
      return this.characterMap.get(characterKey) ?? null
    } catch (error) {
      console.warn('Character resolution failed:', {
        characterKey,
        error: error instanceof Error ? error.message : error,
      })
      return null
    }
  }
}

/**
 * IsCharacter
 */
export function checkIsCharacter(omikujiData: OmikujiDataType): boolean {
  const { featureUsage, characters, settings } = omikujiData
  const usageCharacters = featureUsage.usage.characters
  const hasCharacters = Object.keys(characters).length > 0
  const mode = resolveSettingMode(settings.licenseKeyHash)

  return hasAccessPure(usageCharacters, mode) && hasCharacters
}
