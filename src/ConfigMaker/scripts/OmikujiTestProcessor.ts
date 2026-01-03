// src\ConfigMaker\scripts\OmikujiTestProcessor.ts
import {
  defaultPlaceholdersShortLabels,
  OmikujiDataType,
  OmikujiItemSchema,
  OmikujiItemType,
  PostActionType,
} from '@/types/'
import { BotMessage } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiResultProcessor } from '@main/scripts/OmikujiProcess/OmikujiResultProcessor'
import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

export class OmikujiTestProcessor {
  private readonly resultProcessor: OmikujiResultProcessor

  constructor(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
    this.resultProcessor = new OmikujiResultProcessor(omikujiData, scriptManager)
  }

  /**
   * おみくじの直接指定
   */
  executeOmikujiDirect(omikujiItem: OmikujiItemType, omiken?: OmikenCommentType): BotMessage[] {
    const defaultPlaceholders = this.getSamplePlaceholders()
    this.resultProcessor.insertDefaultPlaceholders(defaultPlaceholders)

    // おみくじを直接実行
    return this.resultProcessor.process(omikujiItem, omiken)
  }

  /**
   * PostActionのみを実行（テスト用・簡易実行）
   * ルール情報やスクリプト実行なしで、PostActionを直接BotMessageに変換
   */
  executePostActionsOnly(actions: PostActionType[], omiken?: OmikenCommentType): BotMessage[] {
    const dummyOmikujiItem: OmikujiItemType = OmikujiItemSchema.parse({ postActions: actions })
    return this.executeOmikujiDirect(dummyOmikujiItem, omiken)
  }

  /**
   * サンプルデフォルトプレースホルダーの挿入
   */
  private getSamplePlaceholders(): Record<string, string | number> {
    return defaultPlaceholdersShortLabels
  }
}
