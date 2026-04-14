// src/types/MainGenerator/OmikujiResultTypes.ts
import { PostFlowType, ScriptGameExtendedKeyType } from '@/types/OmikujiData/'
import { ExtraListsType, ExtraSlotsType } from '@/types/MainGenerator/BotMessageSchema'

/**
 * 変数プレースホルダーの解析結果
 * VariablePlaceholderProcessor.ts の ProcessResult と構造を一致させる
 */
export interface VariablePlaceholderExtra {
  scriptKey: ScriptGameExtendedKeyType
  lists?: ExtraListsType
  slots?: ExtraSlotsType
}

export interface VariablePlaceholderResult {
  bubble: string
  extra?: VariablePlaceholderExtra
  hasError?: boolean
}

/**
 * 処理済みのアクションと解析結果をセットにした型
 */
export interface ProcessedPostAction {
  action: PostFlowType
  extra?: VariablePlaceholderExtra
}
