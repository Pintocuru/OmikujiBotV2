// src/ConfigMaker/components/KeyEditor/composables/useKeyEditor.ts
import { ref, computed, readonly } from 'vue'
import { categoryMap, RecordCategoryType, eventCategoryLabel } from '@/types'
import { validateKey as validateKeyUtil } from './keyEditorValidation'
import { updateStrategies } from './keyUpdateStrategies'
import { CharacterUsage, UpdateResult } from './keyEditorTypes'
import { useGetRecordData } from '@config/stores/useGetRecordData'

export function useKeyEditor() {
  // リアクティブ状態
  const isDialogOpen = ref(false)
  const newKey = ref('')
  const errorMessage = ref('')
  const characterUsage = ref<CharacterUsage | null>(null)

  const hasError = computed(() => errorMessage.value !== '')
  const dialogTitle = computed(() => categoryMap[currentCategory.value].label || '')

  // 現在のカテゴリ（ダイアログで使用）
  const currentCategory = ref<RecordCategoryType>('comments')

  /**
   * キャラクター使用箇所の取得
   */
  function getCharacterUsage(characterKey: string): CharacterUsage {
    const usage: CharacterUsage = { comments: [], timers: [], metas: [], reactions: [] }
    const { getCategoryMap } = useGetRecordData()

    eventCategoryLabel.forEach((category) => {
      const categoryData = getCategoryMap(category)

      Object.entries(categoryData).forEach(([ruleKey, rule]) => {
        const hasUsage = rule.omikuji.some((omikujiSet) =>
          omikujiSet.postActions.some((action) => {
            if (action.actionType !== 'message') return false
            return action.characterKey === characterKey
          })
        )

        if (hasUsage) {
          usage[category].push(ruleKey)
        }
      })
    })

    return usage
  }

  /**
   * Key更新の実行
   */
  function executeKeyUpdate(currentKey: string, newKey: string, category: RecordCategoryType): UpdateResult {
    const trimmedNewKey = newKey.trim()
    const strategy = updateStrategies[category]

    if (!strategy) {
      return { success: false, error: 'サポートされていないカテゴリです' }
    }

    try {
      const success = strategy.updateKey(currentKey, trimmedNewKey)

      if (success && strategy.updateReferences) {
        strategy.updateReferences(currentKey, trimmedNewKey)
      }

      return success ? { success: true } : { success: false, error: 'Key更新に失敗しました' }
    } catch (error) {
      console.error('Key更新エラー:', error)
      return { success: false, error: 'Key更新中にエラーが発生しました' }
    }
  }

  /**
   * Keyバリデーション（エラーメッセージをセット）
   */
  function validateKey(key: string, category: RecordCategoryType, currentKey: string): void {
    errorMessage.value = validateKeyUtil(key, category, currentKey)
  }

  /**
   * ダイアログを開く
   */
  function openDialog(currentKey: string, category: RecordCategoryType): void {
    newKey.value = currentKey
    errorMessage.value = ''
    currentCategory.value = category
    isDialogOpen.value = true

    if (category === 'characters') {
      characterUsage.value = getCharacterUsage(currentKey)
    }
  }

  /**
   * ダイアログを閉じる
   */
  function closeDialog(): void {
    isDialogOpen.value = false
    newKey.value = ''
    errorMessage.value = ''
    characterUsage.value = null
  }

  /**
   * Keyを保存
   */
  function saveKey(currentKey: string, category: RecordCategoryType): boolean {
    if (hasError.value || !newKey.value.trim() || newKey.value === currentKey) {
      return false
    }

    const result = executeKeyUpdate(currentKey, newKey.value, category)

    if (result.success) {
      closeDialog()
      return true
    } else {
      errorMessage.value = result.error || 'Key更新に失敗しました'
      return false
    }
  }

  /**
   * アイテムタイプラベルを取得
   */
  function getItemTypeLabel(category: RecordCategoryType): string {
    return categoryMap[category].label
  }

  // 公開API
  return {
    // リアクティブ状態
    isDialogOpen: readonly(isDialogOpen),
    newKey,
    errorMessage: readonly(errorMessage),
    characterUsage: readonly(characterUsage),
    hasError,
    dialogTitle,

    // メソッド
    validateKey,
    openDialog,
    closeDialog,
    saveKey,
    getItemTypeLabel,
  }
}
