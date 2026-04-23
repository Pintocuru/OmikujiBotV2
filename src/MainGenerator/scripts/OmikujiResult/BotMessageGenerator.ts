// src/MainGenerator/scripts/OmikujiResult/BotMessageGenerator.ts
import { BotMessageType, ProcessedPostAction } from '@/types/'
import { PostFlowType, OmikujiDataType, hasPostFlowMessage } from '@/types/OmikujiData/'
import { createBotMessagesFromAction, createBotMessagesFromVariable } from './BotMessageHelpers'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { CharacterManager, checkIsCharacterMode } from '@main/scripts/CharacterManager/CharacterManager'
import { PostOmikujiService } from '@main/scripts/PostOmikuji/PostOmikujiService'
import { PlaceholderVariableType } from '@main/stores/PlaceholderVariable/PlaceholderVariable'
import { playSoundDelay } from '@sounds/PlaySound'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

export class BotMessageGenerator {
  private readonly variableProcessor: VariablePlaceholderProcessor
  private readonly postMessage: PostOmikujiService
  private readonly soundEnabled: boolean
  private readonly enableSecondary: boolean
  private readonly basicDelaySeconds: number
  private readonly characterManager?: CharacterManager

  constructor(omikujiData: OmikujiDataType, variable: PlaceholderVariableType) {
    this.variableProcessor = new VariablePlaceholderProcessor(variable)
    this.postMessage = new PostOmikujiService(omikujiData)
    this.soundEnabled = omikujiData.settings.soundEnabled
    this.enableSecondary = omikujiData.components?.enableSecondary ?? true
    this.basicDelaySeconds = omikujiData.settings.basicDelaySeconds ?? 1

    // isCharacterMode の影響を受けるコード
    const isCharacterMode = checkIsCharacterMode(omikujiData)
    this.characterManager = isCharacterMode ? new CharacterManager(omikujiData) : undefined
  }

  /**
   * 変数プレースホルダーを処理し、解析結果を保持する型に変換
   */
  processVariables(actions: PostFlowType[]): ProcessedPostAction[] {
    return actions.map((action): ProcessedPostAction => {
      // bubbleがない場合はそのまま
      if (!hasPostFlowMessage(action)) return { action }
      if (!action.message.bubble) return { action }

      // 変数処理の実行（ランキング抽出等）
      const result = this.variableProcessor.process(action.message.bubble)

      // bubbleを置換後のものに差し替え
      return {
        action: { ...action, message: { ...action.message, bubble: result.bubble } },
        extra: result.extra,
      }
    })
  }

  /**
   * わんコメへ投稿し、BotMessageを生成
   */
  postAndGenerate(
    processedActions: ProcessedPostAction[],
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    if (isOnecommePost) {
      // variable は投稿対象から除外
      const postTargets = processedActions.filter((a) => a.action.actionType !== 'variable')
      this.postMessage.post(postTargets.map((a) => a.action))
    }
    return this.generate(processedActions, omiken, isOnecommePost)
  }

  /**
   * 処理済みアクションからBotMessageを生成
   */
  private generate(
    processedActions: ProcessedPostAction[],
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    const messages: BotMessageType[] = []

    for (const item of processedActions) {
      const { action, extra } = item
      const delaySeconds = action.delaySeconds + this.basicDelaySeconds

      if (action.actionType === 'message') {
        // ここで判定：設定が無効なら、action のコピーを作って isToast を false に書き換える
        const effectiveAction =
          !this.enableSecondary && action.message.isToast
            ? { ...action, message: { ...action.message, isToast: false } }
            : action

        messages.push(
          ...createBotMessagesFromAction(
            effectiveAction, // 書き換え後のアクションを渡す
            extra,
            delaySeconds,
            this.characterManager,
            omiken
          )
        )

        if ((action.sound || action.soundPath) && this.soundEnabled && isOnecommePost)
          playSoundDelay(action.sound, action.soundPath, delaySeconds)
      } else if (action.actionType === 'variable') {
        // 投稿なし・音声なし。変数処理と BotMessage 生成のみ
        messages.push(...createBotMessagesFromVariable(extra, delaySeconds, omiken))
      } else if (action.actionType === 'sound') {
        if ((action.sound || action.soundPath) && this.soundEnabled && isOnecommePost)
          playSoundDelay(action.sound, action.soundPath, delaySeconds)
      }
    }

    return messages
  }

  /**
   * 変数プレースホルダー {{ }} を計算せずに除去する（ダミー演出用）
   */
  stripVariables(actions: PostFlowType[]): ProcessedPostAction[] {
    const EVAL_PATTERN = /\{\{[\s\S]*?\}\}/g

    return actions.map((action): ProcessedPostAction => {
      if (action.actionType !== 'message' && action.actionType !== 'variable') return { action }
      if (!action.message.bubble) return { action }

      return {
        action: {
          ...action,
          message: {
            ...action.message,
            bubble: action.message.bubble.replace(EVAL_PATTERN, ''),
          },
        },
      }
    })
  }
}
