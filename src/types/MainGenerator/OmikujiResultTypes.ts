// src/types/MainGenerator/OmikujiResultTypes.ts
import { CharacterEmotionType, PostFlowType } from '@/types/OmikujiData/'
import { ExtraListsType, ExtraSlotsType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

/**
 * 変数プレースホルダーの解析結果
 * VariablePlaceholderProcessor.ts の ProcessResult と構造を一致させる
 */
export interface VariablePlaceholderExtra {
  scriptKey: string
  lists?: ExtraListsType
  slots?: ExtraSlotsType
}

export interface VariablePlaceholderResult {
  bubble: string
  extra?: VariablePlaceholderExtra
}

/**
 * 処理済みのアクションと解析結果をセットにした型
 */
export interface ProcessedPostAction {
  action: PostFlowType
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
  message: VariablePlaceholderResult
  omiken?: OmikenCommentType
}
