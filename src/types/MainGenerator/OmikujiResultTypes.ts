// src/MainGenerator/scripts/OmikujiResult/OmikujiResultTypes.ts
import { PostActionType } from '@/types/OmikujiData/'
import { RankingMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

/**
 * 変数プレースホルダーの解析結果
 * VariablePlaceholderProcessor.ts の ProcessResult と構造を一致させる
 */
export interface VariablePlaceholderResult {
  // 置換後のメッセージ本文
  bubble: string

  // ランキング生成に使用する特定のキー
  name?: string
  text?: string
  symbol?: string
  variant?: string
  unique?: string

  // その他の任意の変数 (VariablePlaceholderProcessor から返される全ての変数)
  [key: string]: string | undefined
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
  iconKey: string
  delaySeconds: number
  isToast: boolean
  bubble: string
  ranking: RankingMessageType | undefined
  omiken?: OmikenCommentType
}
