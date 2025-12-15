// src/MainGenerator/scripts/OmikujiProcess/OmikujiProcessor.ts
import { OmikujiDataType, OmikujiItemSchema, OmikujiItemType, OmikujiSetType, PostActionType } from '@/types'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiExecutor } from './OmikujiExecutor'
import { OmikujiResultProcessor } from './OmikujiResultProcessor'
import { GameScriptManager } from '@MainScripts/GameScript/GameScriptManager'
import { PlaceholderProcessor } from '@MainScripts/PlaceholderProcess/PlaceholderProcessor'
import { BotMessageGenerator } from '@MainScripts/BotCharacter/BotMessageGenerator'
import { Comment } from '@onecomme.com/onesdk/'

/**
 * おみくじ処理の統合クラス
 * 各専門クラスへの処理の委譲とAPIの提供を担当
 */
export class OmikujiProcessor {
  private readonly placeProcess: PlaceholderProcessor
  private readonly executor: OmikujiExecutor
  private readonly resultProcessor: OmikujiResultProcessor

  constructor(omikujiData: OmikujiDataType, scriptManager: GameScriptManager) {
    // 依存関係の初期化
    this.placeProcess = new PlaceholderProcessor(omikujiData.placeholders)
    const botMessageGenerator = new BotMessageGenerator(omikujiData.characters)

    // 専門クラスの初期化
    this.executor = new OmikujiExecutor(this.placeProcess)
    this.resultProcessor = new OmikujiResultProcessor(
      omikujiData,
      this.placeProcess,
      botMessageGenerator,
      scriptManager
    )
  }

  /**
   * おみくじ と 引いたおみくじの処理
   */
  executeOmikuji(omikujiSet: OmikujiSetType, comment?: Comment): BotMessage[] {
    // おみくじ
    const omikujiItem = this.executor.executeWithRule(omikujiSet, comment)
    if (!omikujiItem) return []

    // おみくじの処理
    return this.resultProcessor.process(omikujiItem)
  }

  /**
   * おみくじの直接指定
   * コンフィグエディターからの呼び出しで使用
   */
  executeOmikujiDirect(omikujiItem: OmikujiItemType, comment?: Comment): BotMessage[] {
    this.executor.executeDirect(omikujiItem, comment)
    return this.resultProcessor.process(omikujiItem, comment)
  }

  /**
   * PostActionのみを実行（テスト用・簡易実行）
   * ルール情報やスクリプト実行なしで、PostActionを直接BotMessageに変換
   */
  executePostActionsOnly(actions: PostActionType[], comment?: Comment): BotMessage[] {
    const dummyOmikujiItem: OmikujiItemType = OmikujiItemSchema.parse({
      postActions: actions,
    })

    return this.executeOmikujiDirect(dummyOmikujiItem, comment)
  }
}
