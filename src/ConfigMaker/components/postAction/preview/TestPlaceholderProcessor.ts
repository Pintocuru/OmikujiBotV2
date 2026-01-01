// src\ConfigMaker\components\postAction\preview\TestPlaceholderProcessor.ts
import { PlaceholderProcessor } from '@/MainGenerator/scripts/PlaceholderProcess/PlaceholderProcessor'
import { ExpressionEvaluator } from '@/MainGenerator/scripts/VariablePlaceholder/ExpressionEvaluator'
import { VariablePlaceholderProcessor } from '@/MainGenerator/scripts/VariablePlaceholder/VariableProcessor'
import { defaultPlaceholdersShortLabels, type PlaceholderType } from '@/types'

/**
 * テスト用：メッセージのプレースホルダーを処理して bubble を返す
 */
export const processTestPlaceholder = (message: string, placeholders: Record<string, PlaceholderType>): string => {
  // 静的プレースホルダー
  const staticProcessor = new PlaceholderProcessor(placeholders)
  staticProcessor.updateResolvedValues(defaultPlaceholdersShortLabels)

  const withStatic = staticProcessor.processText(message)

  // 動的プレースホルダー
  // TODO:ExpressionEvaluator は保持したほうがいいのか？
  const dynamicProcessor = new VariablePlaceholderProcessor(new ExpressionEvaluator())
  const processed = dynamicProcessor.process(withStatic)

  return processed.bubble
}
