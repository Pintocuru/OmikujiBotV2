// src\ConfigMaker\components\postAction\preview\TestPlaceholderProcessor.ts
import { PlaceholderProcessor } from '@/MainGenerator/scripts/PlaceholderProcess/PlaceholderProcessor'
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
  const dynamicProcessor = new VariablePlaceholderProcessor()
  const processed = dynamicProcessor.process(withStatic)

  return processed.bubble
}
