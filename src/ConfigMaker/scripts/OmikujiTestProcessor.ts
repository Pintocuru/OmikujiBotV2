// src\ConfigMaker\scripts\OmikujiTestProcessor.ts
import { OmikujiDataType, OmikujiItemSchema, OmikujiItemType, PostActionType } from '@/types'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiResultProcessor } from '@/MainGenerator/scripts/OmikujiProcess/OmikujiResultProcessor'
import { GameScriptManager } from '@MainScripts/GameScript/GameScriptManager'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { DefaultPlaceholderService } from '@/MainGenerator/scripts/OmikujiProcess/DefaultPlaceholderService'

export class OmikujiTestProcessor {
  private readonly defaultManager = new DefaultPlaceholderService()
  private readonly resultProcessor: OmikujiResultProcessor

  constructor(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
    this.resultProcessor = new OmikujiResultProcessor(omikujiData, scriptManager)
  }

  /**
   * おみくじの直接指定
   */
  executeOmikujiDirect(omikujiItem: OmikujiItemType, omiken?: OmikenCommentType): BotMessage[] {
    // デフォルトプレースホルダーの挿入
    const defaultPlaceholders = this.defaultManager.getDefaultComments(omiken)
    this.resultProcessor.insertDefaultPlaceholders(defaultPlaceholders)

    // おみくじを直接実行
    return this.resultProcessor.process(omikujiItem, omiken)
  }

  /**
   * PostActionのみを実行（テスト用・簡易実行）
   * ルール情報やスクリプト実行なしで、PostActionを直接BotMessageに変換
   */
  executePostActionsOnly(actions: PostActionType[], comment?: OmikenCommentType): BotMessage[] {
    const dummyOmikujiItem: OmikujiItemType = OmikujiItemSchema.parse({ postActions: actions })
    return this.executeOmikujiDirect(dummyOmikujiItem, comment)
  }
}
