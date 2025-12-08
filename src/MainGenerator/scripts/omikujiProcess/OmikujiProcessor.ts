// src/MainGenerator/scripts/OmikujiProcess/OmikujiProcessor.ts
import { CommentRuleType, OmikujiDataType, OmikujiItemSchema, OmikujiItemType, PostActionType, RuleType } from '@/types'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiExecutor } from './OmikujiExecutor'
import { OmikujiResultProcessor } from './OmikujiResultProcessor'
import { GameScriptManager } from '@MainScripts/GameScript/GameScriptManager'
import { PlaceholderProcessor } from '@MainScripts/PlaceholderProcess/PlaceholderProcessor'
import { PostMessage } from '@MainScripts/PostMessage/PostMessage'
import { BotMessageGenerator } from '@MainScripts/BotCharacter/BotMessageGenerator'
import { RankingManager } from '@MainScripts/VariablePlaceholder/RankingManager'
import { Comment } from '@onecomme.com/onesdk/'

/**
 * おみくじ処理の統合クラス
 * 各専門クラスへの処理の委譲とAPIの提供を担当
 */
export class OmikujiProcessor {
  private readonly placeProcess: PlaceholderProcessor
  private readonly executor: OmikujiExecutor
  private readonly resultProcessor: OmikujiResultProcessor

  constructor(
    omikujiData: OmikujiDataType,
    private readonly scriptManager?: GameScriptManager
  ) {
    // 依存関係の初期化
    this.placeProcess = new PlaceholderProcessor(omikujiData.placeholders)
    const postMessage = new PostMessage(omikujiData.characters)
    const botMessageGenerator = new BotMessageGenerator(omikujiData.characters)

    // 専門クラスの初期化
    this.executor = new OmikujiExecutor(this.placeProcess, scriptManager)
    this.resultProcessor = new OmikujiResultProcessor(
      omikujiData.actionSets,
      this.placeProcess,
      postMessage,
      botMessageGenerator
    )
  }

  /**
   * おみくじの実行（コメント＋ルール指定）
   */
  executeOmikuji(comment: Comment, rule: RuleType): BotMessage[] {
    const omikujiItem = this.executor.executeWithRule(comment, rule)
    if (!omikujiItem) return []

    // スクリプト結果は executor 内で既に処理済み
    return this.resultProcessor.process(omikujiItem)
  }

  /**
   * おみくじの実行（おみくじアイテムを直接指定）
   * コンフィグエディターからの呼び出しなど、scriptManagerが不要な場合に使用
   */
  executeOmikujiDirect(omikujiItem: OmikujiItemType, comment?: Comment): BotMessage[] {
    this.executor.executeDirect(omikujiItem, comment)
    return this.resultProcessor.process(omikujiItem)
  }

  /**
   * PostActionのみを実行（テスト用・簡易実行）
   * ルール情報やスクリプト実行なしで、PostActionを直接BotMessageに変換
   * @param actions PostAction配列
   * @param comment コメント情報（プレースホルダー用、オプション）
   */
  executePostActionsOnly(actions: PostActionType[], comment?: Comment): BotMessage[] {
    const dummyOmikujiItem: OmikujiItemType = OmikujiItemSchema.parse({
      postActions: actions,
    })

    return this.executeOmikujiDirect(dummyOmikujiItem, comment)
  }

  /**
   * おみくじプロセスの実行（テスト用）
   * コメント、ルール、おみくじアイテムを全て指定して実行
   * @param comment コメント情報
   * @param rule ルール情報
   * @param omikujiItem おみくじアイテム
   */
  executeOmikujiProcess(comment: Comment, rule: RuleType, omikujiItem: OmikujiItemType): BotMessage[] {
    // executorでプレースホルダーとスクリプトを設定
    this.executor.executeDirect(omikujiItem, comment)

    // スクリプトを実行（ルールにscriptIdがある場合）
    if (rule.ruleType === 'comments' && rule.scriptId && this.scriptManager) {
      const scriptResult = this.scriptManager.executeScript(comment, rule as CommentRuleType)
      return this.resultProcessor.process(omikujiItem, scriptResult)
    }

    // スクリプトなしで結果を処理
    return this.resultProcessor.process(omikujiItem)
  }

  // ==========================================
  // ランキング管理API（RankingManagerへの委譲）
  // ==========================================

  /**
   * デバッグ用：特定ルールのランキング情報を取得
   */
  getRanking(ruleId: string): Record<string, number> | null {
    return RankingManager.getRanking(ruleId)
  }

  /**
   * デバッグ用：全ランキング情報を取得
   */
  getAllRankings(): Record<string, Record<string, number>> {
    return RankingManager.getAllRankings()
  }

  /**
   * 特定ルールのランキングをクリア
   */
  clearRanking(ruleId: string): void {
    RankingManager.clearRanking(ruleId)
  }

  /**
   * 全ランキングをクリア
   */
  clearAllRankings(): void {
    RankingManager.clearAllRankings()
  }
}
