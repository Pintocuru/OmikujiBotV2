// src/ConfigMaker/components/postAction/preview/TestPlaceholderProcessor.ts
import { ContentPlaceholder } from '@main/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@main/scripts/ContentPlaceholder/context'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { defaultPlaceholdersShortLabels, type PlaceholderType } from '@/types'
import { PlaceholderVariable } from '@main/stores/PlaceholderVariable/PlaceholderVariable'
import { DisplayVariableResolver } from '@main/scripts/DisplayVariable/DisplayVariableResolver'

/**
 * テスト用：メッセージのプレースホルダーを処理して bubble を返す
 */
export const processTestPlaceholder = (
  message: string,
  placeholders: Record<string, PlaceholderType>
): { text: string; hasError: boolean } => {
  try {
    // 参照プレースホルダー
    const dummyContext = new PlaceholderVariable()
    const displayVariable = new DisplayVariableResolver(dummyContext)
    const resolved = displayVariable.resolve(message)

    // プレースホルダー
    const contentPlaceholder = new ContentPlaceholder(placeholders)
    const context = new PlaceholderContext()
    context.updateValues(defaultPlaceholdersShortLabels)
    contentPlaceholder.updateResolvedValues(context.getAll())
    const withStatic = contentPlaceholder.processText(resolved)

    // 再解決
    const resolved2 = displayVariable.resolve(withStatic)

    // 評価ブロック
    const dynamicProcessor = new VariablePlaceholderProcessor(dummyContext)
    const processed = dynamicProcessor.process(resolved2)

    // 未処理 {{ }} が残っていればエラー
    const hasError = /\{\{[\s\S]*?\}\}/.test(processed.bubble)

    if (hasError) {
      const highlighted = processed.bubble.replace(/\{\{[\s\S]*?\}\}/g, (m) => {
        return m
      })

      return { text: highlighted, hasError: true }
    }

    return { text: processed.bubble, hasError: false }
  } catch {
    return {
      text: message,
      hasError: true,
    }
  }
}
