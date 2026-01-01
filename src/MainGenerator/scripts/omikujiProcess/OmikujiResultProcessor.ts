// src/MainGenerator/scripts/OmikujiProcess/OmikujiResultProcessor.ts
import { BotMessage } from '@/types/MainGenerator/BotMessageSchema'
import { OmikujiDataType } from '@/types'
import { OmikujiItemType, PostActionRecordType, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { PlaceholderProcessor } from '../PlaceholderProcess/PlaceholderProcessor'
import { PostMessage } from '@MainScripts/PostMessage/PostMessage'
import { BotMessageGenerator } from '@/MainGenerator/scripts/BotMessage/BotMessageGenerator'
import { ActionSetExpander } from './ActionSetExpander'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { GameScriptManager } from '../../stores/GameScript/GameScriptManager'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { VariablePlaceholderProcessor } from '../VariablePlaceholder/VariableProcessor'
import { RankingMessageSchema, UserNameSchema } from '@/types/OmikujiData/PostActionMessage'
import { ExpressionEvaluator } from '../VariablePlaceholder/ExpressionEvaluator'

/**
 * おみくじの処理とメッセージ生成を担当するクラス
 */
export class OmikujiResultProcessor {
  private readonly placeProcess: PlaceholderProcessor
  private readonly postMessage: PostMessage
  private readonly botMessageGenerator: BotMessageGenerator
  private readonly actionSets: Record<string, PostActionRecordType>
  private evaluator: ExpressionEvaluator = new ExpressionEvaluator()

  constructor(
    omikujiData: OmikujiDataType,
    private readonly scriptManager: GameScriptManager
  ) {
    // 依存関係の初期化
    this.placeProcess = new PlaceholderProcessor(omikujiData.placeholders)
    this.actionSets = omikujiData.actionSets
    this.botMessageGenerator = new BotMessageGenerator(omikujiData)
    this.postMessage = new PostMessage(omikujiData.characters)
  }

  /**
   * おみくじ結果を処理してBotMessageを生成
   */
  process(omikujiItem: OmikujiItemType, omiken?: OmikenCommentType): BotMessage[] {
    try {
      const postActions: PostActionType[] = []

      // おみくじアクションから postActions を生成
      postActions.push(...this.processOmikujiActions(omikujiItem, omiken))

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
  private processOmikujiActions(omikujiItem: PostActionRecordType, omiken?: OmikenCommentType): PostActionType[] {
    // アクションセットの展開
    const expandedActions = ActionSetExpander.expand(omikujiItem.postActions, this.actionSets)

    // プレースホルダーを実行
    const processedActions = this.placeProcess.processPostActions(expandedActions)

    // bubble と toast に対して変数プレースホルダーを実行
    return this.applyVariablePlaceholders(processedActions, omiken)
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
   * text,symbol,name,unique,variant が特殊になる
   */
  private applyVariablePlaceholders(actions: PostActionType[], omiken?: OmikenCommentType): PostActionType[] {
    const variableProcessor = new VariablePlaceholderProcessor(this.evaluator)

    return actions.map((action) => {
      if (action.actionType !== 'message') return action

      // デフォルト情報を付与(TODO:ちゃんと切り分けて)
      action.message.user = omiken
        ? UserNameSchema.parse({
            name: omiken?.userName,
            userId: omiken?.userId,
            profileImage: omiken?.profileImage,
          })
        : undefined

      // 変数プレースホルダー処理
      const { bubble, toast } = action.message
      const sourceText = bubble ?? toast
      if (!sourceText) return action

      const result = variableProcessor.process(sourceText)

      // textがなければランキング不成立
      const isBasicList = result.text
      const ranking = isBasicList
        ? RankingMessageSchema.parse({
            scriptKey: 'basicList',
            listName: result.name,
            scoreText: result.text,
            symbol: result.symbol,
            variant: result.variant,
            isUniqueUser: result.unique === 'false' ? false : true,
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
