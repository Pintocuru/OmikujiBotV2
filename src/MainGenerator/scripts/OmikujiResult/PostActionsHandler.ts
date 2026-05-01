// src/MainGenerator/scripts/OmikujiResult/PostActionsHandler.ts
import { BotMessageType, ProcessedPostAction } from '@/types'
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
    // 1. アクション展開とプレースホルダー置換
    const expandedActions = ActionSetExpander.expand(actionItem.postActions, this.actionSets)
    const displayResolved = this.displayResolver.processPostActions(expandedActions)

    this.placeContext.updateValues(defaultPlaceholders)
    this.placeProcess.updateResolvedValues(this.placeContext.getAll())
    const resolvedActions = this.placeProcess.processPostActions(displayResolved)
    this.placeContext.clear()

    // 2. 評価ブロック {{ }} の処理
    const processedActions: ProcessedPostAction[] = isOnecommePost
      ? this.generator.processVariables(resolvedActions) // 本番：計算して置換
      : this.generator.stripVariables(resolvedActions) // ダミー：計算せず除去

    // 3. BotMessage 生成
    return this.generator.postAndGenerate(processedActions, omiken, isOnecommePost)
  }
}
