// src/MainGenerator/scripts/OmikujiResult/OmikujiResultTypes.ts
import { CharacterEmotionType, PostActionType } from '@/types/OmikujiData/'
import { ExtraMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

/**
 * 変数プレースホルダーの解析結果
 * VariablePlaceholderProcessor.ts の ProcessResult と構造を一致させる
 */
export interface VariablePlaceholderResult {
  bubble: string // 置換後のメッセージ本文
  componentKey?: string // ランキング生成に使用する特定のキー
  ranking?: ExtraMessageType // ランキング生成に使用する特定のキー
}

/**
 * 処理済みのアクションと解析結果をセットにした型
 */
export interface ProcessedPostAction {
  action: PostActionType
  variableResult?: VariablePlaceholderResult
}

/**
 * BotMessage生成に使用するパラメータ
 * BotMessageFactory.createBotMessages の引数型として使用
 */
export interface CreateBotMessageParams {
  characterKey: string
  iconKey: CharacterEmotionType
  delaySeconds: number
  isToast: boolean
  bubble: string
  componentKey?: string
  ranking?: ExtraMessageType
  omiken?: OmikenCommentType
}
