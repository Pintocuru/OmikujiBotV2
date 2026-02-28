// src/ConfigMaker/components/postAction/preview/TestPlaceholderProcessor.ts
import { ContentPlaceholder } from '@main/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@main/scripts/ContentPlaceholder/context'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { defaultPlaceholdersShortLabels, type PlaceholderType } from '@/types/'
import { ScriptVariableContext } from '@/MainGenerator/scripts/VariablePlaceholder/ScriptVariableContext'
import { DisplayVariableResolver } from '@/MainGenerator/scripts/DisplayVariable/DisplayVariableResolver'

/**
 * テスト用：メッセージのプレースホルダーを処理して bubble を返す
 */
export const processTestPlaceholder = (message: string, placeholders: Record<string, PlaceholderType>): string => {
  try {
    // 参照プレースホルダー
    const dummyContext = new ScriptVariableContext()
    const displayVariable = new DisplayVariableResolver(dummyContext)
    const resolved = displayVariable.resolve(message)

    // プレースホルダー
    const contentPlaceholder = new ContentPlaceholder(placeholders)
    const context = new PlaceholderContext()
    context.updateValues(defaultPlaceholdersShortLabels)
    contentPlaceholder.updateResolvedValues(context.getAll())
    const withStatic = contentPlaceholder.processText(resolved)

    // プレースホルダー展開後、もう1回変換する
    const resolved2 = displayVariable.resolve(withStatic)

    // 評価ブロック(変数プレースホルダー)
    const dynamicProcessor = new VariablePlaceholderProcessor(dummyContext)
    const processed = dynamicProcessor.process(resolved2)

    return processed.bubble
  } catch {
    // ★ プレビューでは失敗しても原文を返す
    return message
  }
}
