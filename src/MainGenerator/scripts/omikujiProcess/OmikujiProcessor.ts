// src\MainGenerator\scripts\OmikujiProcess\OmikujiProcessor.ts
import { CommentRuleType, RuleType } from '@/types/OmikujiData/RulesSchema'
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiItemType, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { ScriptResult } from '@/types/GameScript/GameScriptTypes'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { GameScriptManager } from '../GameScript/GameScriptManager'
import { DefaultPlaceholderService } from './DefaultPlaceholderService'
import { PlaceholderProcessor } from '../PlaceholderProcess/PlaceholderProcessor'
import { PostMessage } from '@MainScripts/PostMessage/PostMessage'
import { BotMessageGenerator } from '@MainScripts/BotCharacter/BotMessageGenerator'
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { RankingManager } from '../VariablePlaceholder/RankingManager'
import { Comment } from '@onecomme.com/onesdk/'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'

export class OmikujiProcessor {
  private readonly placeProcess: PlaceholderProcessor
  private readonly postMessage: PostMessage
  private readonly botMessageGenerator: BotMessageGenerator
  private readonly defaultManager = new DefaultPlaceholderService()

  constructor(
    omikujiData: OmikujiDataType,
    private readonly scriptManager?: GameScriptManager
  ) {
    this.placeProcess = new PlaceholderProcessor(omikujiData.placeholders)
    this.postMessage = new PostMessage(omikujiData.characters)
    this.botMessageGenerator = new BotMessageGenerator(omikujiData.characters)
  }

  /**
   * おみくじの実行（コメント＋ルール指定）
   */
  executeOmikuji(comment: Comment, rule: RuleType): BotMessage[] {
    // ランキング機能が有効な場合は、事前にランクを設定
    const processedOmikuji = RankingManager.assignRanks(rule.id, rule.omikuji)

    const omikujiItem = drawOmikuji(processedOmikuji) as OmikujiItemType
    if (!omikujiItem) return []

    return this.executeOmikujiProcess(comment, rule, omikujiItem)
  }

  /**
   * おみくじの実行（おみくじアイテムを直接指定）
   * コンフィグエディターからの呼び出しなど、 scriptManagerが不要な場合に使用
   */
  executeOmikujiDirect(omikujiItem: OmikujiItemType, comment?: Comment): BotMessage[] {
    try {
      if (comment) {
        const defaultPlaceholders = this.defaultManager.getDefaultComments(comment)
        this.placeProcess.updateResolvedValues(defaultPlaceholders)
      }

      return this.processOmikuji(omikujiItem)
    } catch (error) {
      ConsolePost('error', `おみくじ直接実行エラー`, error)
      return []
    }
  }

  /**
   * おみくじプロセスの実行
   */
  executeOmikujiProcess(comment: Comment, rule: RuleType, omikujiItem: OmikujiItemType): BotMessage[] {
    try {
      // Defaultのプレースホルダーを設定
      const defaultPlaceholders = this.defaultManager.getDefaultComments(comment)
      this.placeProcess.updateResolvedValues(defaultPlaceholders)

      // ランク情報を設定
      this.setupRankingContext(rule, omikujiItem)

      // scriptIdが存在し、scriptManagerが存在する場合のみスクリプトを実行
      const shouldExecuteScript = this.hasValidScript(rule) && this.scriptManager
      let scriptResult: ScriptResult | null = null

      if (shouldExecuteScript) {
        scriptResult = this.scriptManager!.executeScript(comment, rule as CommentRuleType)
      }

      return this.processOmikuji(omikujiItem, scriptResult)
    } catch (error) {
      ConsolePost('error', `おみくじプロセス実行エラー`, error)
      return []
    }
  }

  /**
   * ランキング機能のコンテキストを設定
   */
  private setupRankingContext(rule: RuleType, omikujiItem: OmikujiItemType): void {
    // おみくじアイテムに rank が設定されている場合
    const rankingScore = omikujiItem.rankingScore
    const totalItems = rule.omikuji.length

    // PlaceholderProcessorにランキング情報を設定
    this.placeProcess.setVariableContext(rankingScore, totalItems)
  }

  /**
   * ルールが有効なスクリプトを持っているかチェック
   */
  private hasValidScript(rule: RuleType): boolean {
    // CommentRuleTypeの場合のみscriptIdをチェック
    if (rule.ruleType === 'comments') return !!rule.scriptId

    // TimerRuleTypeの場合はscriptIdが存在しない
    // TODO:TimerでもscriptIdをもたせる予定
    return false
  }

  /**
   * おみくじ処理
   */
  private processOmikuji(omikujiItem: OmikujiItemType, scriptResult?: ScriptResult | null): BotMessage[] {
    try {
      // スクリプト結果がある場合は先に処理
      if (scriptResult) {
        // scriptのプレースホルダーをClassに追加
        this.placeProcess.updateResolvedValues(scriptResult.placeholders)
        // scriptのpostActionsを投稿する
        this.postMessage.post(scriptResult.postActions)
      }

      // アクションセット処理
      const appStore = useAppStore()
      const actionSets = appStore.data.actionSets

      // postActionsを展開（actionSetを実際のアクションに置き換え）
      const expandedPostActions = this.expandActionSets(omikujiItem.postActions, actionSets)

      // プレースホルダー処理
      const postActions = this.placeProcess.processPostActions(expandedPostActions)
      // おみくじのpostActionsを投稿する
      this.postMessage.post(postActions)

      return this.botMessageGenerator.generateMessages(postActions)
    } finally {
      this.placeProcess.clearResolvedValues()
    }
  }
  /**
   * アクションセットを展開する（再帰的、最大10階層）
   * @param actions 展開対象のアクション配列
   * @param actionSets 全アクションセットのデータ
   * @param depth 現在の展開階層（デフォルト: 0）
   * @param visited 訪問済みのアクションセットキー（循環参照防止用）
   * @returns 展開されたアクション配列
   */
  private expandActionSets(
    actions: PostActionType[],
    actionSets: Record<string, { postActions: PostActionType[] }>,
    depth: number = 0,
    visited: Set<string> = new Set()
  ): PostActionType[] {
    // 最大展開回数チェック
    if (depth >= 10) {
      ConsolePost('warn', `アクションセットの展開が最大階層(10)に達しました`)
      return actions
    }

    const expandedActions: PostActionType[] = []

    for (const action of actions) {
      if (action.actionType === 'actionSet' && action.actionSetKey) {
        const cleanedAction = this.cleanActionSetAction(action)
        const targetKey = cleanedAction.actionSetKey

        // 循環参照チェック
        if (visited.has(targetKey)) {
          ConsolePost('error', `循環参照が検出されました: ${targetKey}`)
          continue
        }

        const targetActionSet = actionSets[targetKey]

        if (!targetActionSet) {
          ConsolePost('warn', `アクションセット "${targetKey}" が見つかりません`)
          continue
        }

        // 新しいvisitedセットを作成（このブランチ専用）
        const newVisited = new Set(visited)
        newVisited.add(targetKey)

        // アクションセットの各アクションにdelaySecondsを加算
        const baseDelay = cleanedAction.delaySeconds
        const adjustedActions = targetActionSet.postActions.map((setAction) => ({
          ...setAction,
          delaySeconds: (setAction.delaySeconds || 0) + baseDelay,
        }))

        // 再帰的に展開（次の階層）
        const recursiveExpanded = this.expandActionSets(adjustedActions, actionSets, depth + 1, newVisited)

        expandedActions.push(...recursiveExpanded)
      } else {
        // actionSet以外のアクションはそのまま追加
        expandedActions.push(action)
      }
    }

    return expandedActions
  }

  /**
   * actionSet用のアクションから不要なプロパティを削除
   */
  private cleanActionSetAction(action: PostActionType): {
    actionType: 'actionSet'
    actionSetKey: string
    delaySeconds: number
  } {
    return {
      actionType: 'actionSet',
      actionSetKey: action.actionSetKey!,
      delaySeconds: action.delaySeconds || 0,
    }
  }

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
