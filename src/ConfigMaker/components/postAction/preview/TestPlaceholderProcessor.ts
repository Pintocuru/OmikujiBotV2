// src/ConfigMaker/components/postAction/preview/TestPlaceholderProcessor.ts
import { PlaceholderProcessor } from '@main/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@main/scripts/ContentPlaceholder/context'
import { ExpressionEvaluator } from '@main/scripts/VariablePlaceholder/ExpressionEvaluator'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { defaultPlaceholdersShortLabels, type PlaceholderType } from '@/types/'

/**
 * テスト用：メッセージのプレースホルダーを処理して bubble を返す
 */
export const processTestPlaceholder = (message: string, placeholders: Record<string, PlaceholderType>): string => {
  // 静的プレースホルダー
  const staticProcessor = new PlaceholderProcessor(placeholders)
  const context = new PlaceholderContext()
  context.updateValues(defaultPlaceholdersShortLabels)
  staticProcessor.updateResolvedValues(context.getAll())

  const withStatic = staticProcessor.processText(message)

  // 動的プレースホルダー
  const dynamicProcessor = new VariablePlaceholderProcessor()
  const processed = dynamicProcessor.process(withStatic)

  return processed.bubble
}
