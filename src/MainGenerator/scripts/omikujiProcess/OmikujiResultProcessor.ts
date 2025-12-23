// src/MainGenerator/scripts/OmikujiProcess/OmikujiResultProcessor.ts
import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
import { OmikujiDataType } from '@/types'
import { OmikujiItemType, PostActionRecordType, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { PlaceholderProcessor } from '../PlaceholderProcess/PlaceholderProcessor'
import { PostMessage } from '@MainScripts/PostMessage/PostMessage'
import { BotMessageGenerator } from '@MainScripts/BotCharacter/BotMessageGenerator'
import { ActionSetExpander } from './ActionSetExpander'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { GameScriptManager } from '../GameScript/GameScriptManager'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { VariablePlaceholderProcessor } from '../VariablePlaceholder/VariableProcessor'
import { RankingMessageSchema } from '@/types/OmikujiData/PostActionMessage'

/**
 * おみくじの処理とメッセージ生成を担当するクラス
 */
export class OmikujiResultProcessor {
  private readonly placeProcess: PlaceholderProcessor
  private readonly postMessage: PostMessage
  private readonly botMessageGenerator: BotMessageGenerator
  private readonly actionSets: Record<string, PostActionRecordType>

  constructor(
    omikujiData: OmikujiDataType,
    private readonly scriptManager: GameScriptManager
  ) {
    // 依存関係の初期化
    this.placeProcess = new PlaceholderProcessor(omikujiData.placeholders)
    this.actionSets = omikujiData.actionSets
    this.botMessageGenerator = new BotMessageGenerator(omikujiData.characters)
    this.postMessage = new PostMessage(omikujiData.characters)
  }

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  process(omikujiItem: OmikujiItemType, omiken?: OmikenCommentType): BotMessage[] {
    try {
      const postActions: PostActionType[] = []

      // おみくじアクションから postActions を生成
      postActions.push(...this.processOmikujiActions(omikujiItem))

      // gameScripts 処理
      if (omikujiItem.gameScripts) {
        const gamePost = this.scriptManager.playScript(omikujiItem, omiken)
        if (gamePost) postActions.push(...gamePost)
      }

      // postActions があれば投稿
      if (postActions) {
        // メッセージ投稿
        this.postMessage.post(postActions)

        // BotMessage生成
        return this.botMessageGenerator.generateMessages(postActions)
      }
      return []
    } catch (error) {
      ConsolePost('error', `おみくじ結果処理エラー`, error)
      return []
    } finally {
      this.placeProcess.clearResolvedValues()
    }
  }

  /**
   * おみくじアクションの処理
   */
  private processOmikujiActions(omikujiItem: PostActionRecordType): PostActionType[] {
    // アクションセットの展開
    const expandedActions = ActionSetExpander.expand(omikujiItem.postActions, this.actionSets)

    // プレースホルダーを実行
    const processedActions = this.placeProcess.processPostActions(expandedActions)

    // bubble と toast に対して変数プレースホルダーを実行
    return this.applyVariablePlaceholders(processedActions)
  }

  /**
   * デフォルトプレースホルダーの挿入
   */
  insertDefaultPlaceholders(defaultPlaceholders: Record<string, string | number>): void {
    this.placeProcess.updateResolvedValues(defaultPlaceholders)
  }

  /**
   * message.action の bubble / toast に対して
   * 変数プレースホルダーを適用する
   * text と symbol が特殊になる
   */
  private applyVariablePlaceholders(actions: PostActionType[]): PostActionType[] {
    const variableProcessor = new VariablePlaceholderProcessor()

    return actions.map((action) => {
      if (action.actionType !== 'message') return action

      const { bubble, toast } = action.message
      const sourceText = bubble ?? toast
      if (!sourceText) return action

      const result = variableProcessor.process(sourceText)

      const isBasicList = result.text
      const ranking = isBasicList
        ? RankingMessageSchema.parse({
            scriptKey: 'basicList',
            scoreText: result.text,
            symbol: result.symbol,
            isUniqueUser: true,
          })
        : undefined

      return {
        ...action,
        message: {
          ...action.message,
          ...(bubble ? { bubble: result.bubble } : { toast: result.bubble }),
          ranking,
        },
      }
    })
  }
}
