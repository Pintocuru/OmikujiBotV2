// src\ConfigMaker\components\parts\useKeyEditor\keyEditorValidation.ts
import { RecordCategoryType } from '@/types/'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'

/**
 * IDの基本フォーマットバリデーション
 */
export function validateIdFormat(id: string): string | null {
  const trimmedId = id.trim()

  if (!trimmedId) return 'IDを入力してください'
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedId)) {
    return 'IDは英数字、アンダースコア(_)、ハイフン(-)のみ使用可能です'
  }

  return null
}

/**
 * ID重複チェック
 */
export function validateIdDuplication(id: string, category: RecordCategoryType, currentId: string): string | null {
  if (id === currentId) return null

  const omikujiStore = useOmikujiStore()
  const existingIds = Object.keys(omikujiStore.getCategoryMap(category)).filter(
    (existingId) => existingId !== currentId
  )

  return existingIds.includes(id) ? 'このIDは既に使用されています' : null
}

/**
 * 統合IDバリデーション
 */
export function validateId(id: string, category: RecordCategoryType, currentId: string): string {
  const trimmedId = id.trim()

  const formatError = validateIdFormat(trimmedId)
  if (formatError) return formatError

  const duplicateError = validateIdDuplication(trimmedId, category, currentId)
  if (duplicateError) return duplicateError

  return ''
}
