// src\ConfigMaker\scripts\OmikujiTestProcessor.ts
import { ActionSetSchema, ActionSetType, defaultPlaceholdersShortLabels, OmikujiDataType, PostFlowType } from '@/types/'
import { BotMessageType } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiResultProcessor } from '@main/scripts/OmikujiResult/OmikujiResultProcessor'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

export class OmikujiTestProcessor {
  private readonly resultProcessor: OmikujiResultProcessor

  constructor(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
    this.resultProcessor = new OmikujiResultProcessor(omikujiData, scriptManager.playScript)
  }

  /**
   * おみくじの直接指定
   */
  executeOmikujiDirect(actionItem: ActionSetType, omiken?: OmikenCommentType): BotMessageType[] {
    const defaultPlaceholders = this.getSamplePlaceholders()
    return this.resultProcessor.process(actionItem, defaultPlaceholders, omiken)
  }

  /**
   * PostActionのみを実行（テスト用・簡易実行）
   * ルール情報やスクリプト実行なしで、PostActionを直接BotMessageに変換
   */
  executePostActionsOnly(actions: PostFlowType[], omiken?: OmikenCommentType): BotMessageType[] {
    const actionItem: ActionSetType = ActionSetSchema.parse({ postActions: actions })
    return this.executeOmikujiDirect(actionItem, omiken)
  }

  /**
   * サンプルデフォルトプレースホルダーの挿入
   */
  private getSamplePlaceholders(): Record<string, string | number> {
    return defaultPlaceholdersShortLabels
  }
}
