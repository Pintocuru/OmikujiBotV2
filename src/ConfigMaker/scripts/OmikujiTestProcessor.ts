// src\ConfigMaker\scripts\OmikujiTestProcessor.ts
import { OmikujiDataType, OmikujiItemSchema, OmikujiItemType, PostActionType } from '@/types'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiExecutor } from '@/MainGenerator/scripts/OmikujiProcess/OmikujiExecutor'
import { OmikujiResultProcessor } from '@/MainGenerator/scripts/OmikujiProcess/OmikujiResultProcessor'
import { GameScriptManager } from '@MainScripts/GameScript/GameScriptManager'
import { PlaceholderProcessor } from '@MainScripts/PlaceholderProcess/PlaceholderProcessor'
import { BotMessageGenerator } from '@MainScripts/BotCharacter/BotMessageGenerator'
import { Comment } from '@onecomme.com/onesdk/'

export class OmikujiTestProcessor {
  private readonly placeProcess: PlaceholderProcessor
  private readonly executor: OmikujiExecutor
  private readonly resultProcessor: OmikujiResultProcessor

  constructor(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
    this.placeProcess = new PlaceholderProcessor(omikujiData.placeholders)
    const botMessageGenerator = new BotMessageGenerator(omikujiData.characters)

    this.executor = new OmikujiExecutor(this.placeProcess)
    this.resultProcessor = new OmikujiResultProcessor(
      omikujiData,
      this.placeProcess,
      botMessageGenerator,
      scriptManager
    )
  }

  /**
   * おみくじの直接指定
   * コンフィグエディターからの呼び出しで使用
   */
  executeOmikujiDirect(omikujiItem: OmikujiItemType, comment?: OmikenCommentType): BotMessage[] {
    this.executor.executeDirect(omikujiItem, comment)
    return this.resultProcessor.process(omikujiItem, comment)
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
