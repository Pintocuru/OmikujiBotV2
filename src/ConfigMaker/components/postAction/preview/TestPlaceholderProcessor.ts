// src/ConfigMaker/components/postAction/preview/TestPlaceholderProcessor.ts
import { ContentPlaceholder } from '@main/scripts/ContentPlaceholder/processor'
import { PlaceholderContext } from '@main/scripts/ContentPlaceholder/context'
import { VariablePlaceholderProcessor } from '@main/scripts/VariablePlaceholder/VariableProcessor'
import { defaultPlaceholdersShortLabels, type PlaceholderType } from '@/types/'

/**
 * テスト用：メッセージのプレースホルダーを処理して bubble を返す
 */
export const processTestPlaceholder = (message: string, placeholders: Record<string, PlaceholderType>): string => {
  // 静的プレースホルダー
  const contentPlaceholder = new ContentPlaceholder(placeholders)
  const context = new PlaceholderContext()
  context.updateValues(defaultPlaceholdersShortLabels)
  contentPlaceholder.updateResolvedValues(context.getAll())

  const withStatic = contentPlaceholder.processText(message)

  // 動的プレースホルダー
  const dynamicProcessor = new VariablePlaceholderProcessor()
  const processed = dynamicProcessor.process(withStatic)

  return processed.bubble
}
