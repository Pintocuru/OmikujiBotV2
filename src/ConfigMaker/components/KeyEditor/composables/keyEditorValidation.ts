// src/ConfigMaker/components/KeyEditor/composables/keyEditorValidation.ts
import { RecordCategoryType } from '@/types'
import { useGetRecordData } from '@config/stores/useGetRecordData'

/**
 * Keyの基本フォーマットバリデーション
 */
export function validateKeyFormat(key: string): string | null {
  const trimmedKey = key.trim()

  if (!trimmedKey) return 'Keyを入力してください'
  if (!/^[a-zA-Z0-9_-]+$/.test(trimmedKey)) {
    return 'Keyは英数字、アンダースコア(_)、ハイフン(-)のみ使用可能です'
  }

  return null
}

/**
 * Key重複チェック
 */
export function validateKeyDuplication(key: string, category: RecordCategoryType, currentKey: string): string | null {
  if (key === currentKey) return null
  const { getCategoryMap } = useGetRecordData()
  const keys = Object.keys(getCategoryMap(category)).filter((key) => key !== currentKey)
  return keys.includes(key) ? 'このKeyは既に使用されています' : null
}

/**
 * 統合Keyバリデーション
 */
export function validateKey(key: string, category: RecordCategoryType, currentKey: string): string {
  const trimmedKey = key.trim()

  const formatError = validateKeyFormat(trimmedKey)
  if (formatError) return formatError

  const duplicateError = validateKeyDuplication(trimmedKey, category, currentKey)
  if (duplicateError) return duplicateError

  return ''
}
