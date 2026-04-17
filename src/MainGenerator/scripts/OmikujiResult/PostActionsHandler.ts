// src/MainGenerator/scripts/OmikujiResult/PostActionsHandler.ts
import { BotMessageType, ProcessedPostAction } from '@/types/'
import { ActionSetType, OmikujiDataType } from '@/types/OmikujiData/'
import { ContentPlaceholder } from '@main/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@main/scripts/ContentPlaceholder/context'
import { ActionSetExpander } from '@main/scripts/OmikujiProcess/ActionSetExpander'
import { DisplayVariableResolver } from '@main/scripts/DisplayVariable/DisplayVariableResolver'
import { PlaceholderVariableType } from '@main/stores/PlaceholderVariable/PlaceholderVariable'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { BotMessageGenerator } from './BotMessageGenerator'

export class PostActionsHandler {
  private readonly displayResolver: DisplayVariableResolver
  private readonly placeProcess: ContentPlaceholder
  private readonly placeContext: PlaceholderContext = new PlaceholderContext()
  private readonly actionSets: Record<string, ActionSetType>

  constructor(
    omikujiData: OmikujiDataType,
    variable: PlaceholderVariableType,
    private readonly generator: BotMessageGenerator
  ) {
    this.displayResolver = new DisplayVariableResolver(variable)
    this.placeProcess = new ContentPlaceholder(omikujiData.placeholders)
    this.actionSets = omikujiData.actionSets
  }

  /**
   * postActions処理
   */
  process(
    actionItem: ActionSetType,
    defaultPlaceholders: Record<string, string | number>,
    omiken?: OmikenCommentType,
    isOnecommePost?: boolean
  ): BotMessageType[] {
    // アクションを展開
    const expandedActions = ActionSetExpander.expand(actionItem.postActions, this.actionSets)

    // 変数展開
    const displayResolved = this.displayResolver.processPostActions(expandedActions)

    // プレースホルダー処理
    this.placeContext.updateValues(defaultPlaceholders)
    this.placeProcess.updateResolvedValues(this.placeContext.getAll())
    const resolvedActions = this.placeProcess.processPostActions(displayResolved)
    this.placeContext.clear()

    // 1. 評価ブロック(変数プレースホルダー)を処理
    const processedActions: ProcessedPostAction[] = isOnecommePost
      ? this.generator.processVariables(resolvedActions)
      : resolvedActions.map((action): ProcessedPostAction => ({ action }))

    // 2. わんコメへ投稿 & BotMessage を生成
    return this.generator.postAndGenerate(processedActions, omiken, isOnecommePost)
  }
}
