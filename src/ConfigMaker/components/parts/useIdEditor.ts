// src/configMaker/components/parts/useIdEditor.ts
import { ref, computed, readonly } from 'vue'
import { RecordCategoryType } from '@/types/'
import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
import { validateId as validateIdUtil } from './useIdEditor/idEditorValidation'
import { updateStrategies } from './useIdEditor/idUpdateStrategies'
import { CharacterUsage, UpdateResult, CATEGORY_TITLES, ITEM_TYPE_LABELS } from './useIdEditor/idEditorTypes'

export function useIdEditor() {
  const omikujiStore = useOmikujiStore()

  // リアクティブ状態
  const isDialogOpen = ref(false)
  const newId = ref('')
  const errorMessage = ref('')
  const characterUsage = ref<CharacterUsage | null>(null)

  const hasError = computed(() => errorMessage.value !== '')
  const dialogTitle = computed(() => CATEGORY_TITLES[currentCategory.value] || '')

  // 現在のカテゴリ（ダイアログで使用）
  const currentCategory = ref<RecordCategoryType>('comments')

  /**
   * キャラクター使用箇所の取得
   */
  function getCharacterUsage(characterId: string): CharacterUsage {
    const usage: CharacterUsage = { comments: [], timers: [] }

    ;(['comments', 'timers'] as const).forEach((category) => {
      const categoryData = omikujiStore.getCategoryMap(category)

      Object.entries(categoryData).forEach(([ruleId, rule]) => {
        const hasUsage = rule.omikuji.some((omikujiSet) =>
          omikujiSet.postActions.some((action) => action.characterKey === characterId)
        )

        if (hasUsage) {
          usage[category].push(ruleId)
        }
      })
    })

    return usage
  }

  /**
   * ID更新の実行
   */
  function executeIdUpdate(currentId: string, newId: string, category: RecordCategoryType): UpdateResult {
    const trimmedNewId = newId.trim()
    const strategy = updateStrategies[category]

    if (!strategy) {
      return { success: false, error: 'サポートされていないカテゴリです' }
    }

    try {
      const success = strategy.updateId(currentId, trimmedNewId)

      if (success && strategy.updateReferences) {
        strategy.updateReferences(currentId, trimmedNewId)
      }

      return success ? { success: true } : { success: false, error: 'ID更新に失敗しました' }
    } catch (error) {
      console.error('ID更新エラー:', error)
      return { success: false, error: 'ID更新中にエラーが発生しました' }
    }
  }

  /**
   * IDバリデーション（エラーメッセージをセット）
   */
  function validateId(id: string, category: RecordCategoryType, currentId: string): void {
    errorMessage.value = validateIdUtil(id, category, currentId)
  }

  /**
   * ダイアログを開く
   */
  function openDialog(currentId: string, category: RecordCategoryType): void {
    newId.value = currentId
    errorMessage.value = ''
    currentCategory.value = category
    isDialogOpen.value = true

    if (category === 'characters') {
      characterUsage.value = getCharacterUsage(currentId)
    }
  }

  /**
   * ダイアログを閉じる
   */
  function closeDialog(): void {
    isDialogOpen.value = false
    newId.value = ''
    errorMessage.value = ''
    characterUsage.value = null
  }

  /**
   * IDを保存
   */
  function saveId(currentId: string, category: RecordCategoryType): boolean {
    if (hasError.value || !newId.value.trim() || newId.value === currentId) {
      return false
    }

    const result = executeIdUpdate(currentId, newId.value, category)

    if (result.success) {
      closeDialog()
      return true
    } else {
      errorMessage.value = result.error || 'ID更新に失敗しました'
      return false
    }
  }

  /**
   * アイテムタイプラベルを取得
   */
  function getItemTypeLabel(category: RecordCategoryType): string {
    return ITEM_TYPE_LABELS[category]
  }

  // 公開API
  return {
    // リアクティブ状態
    isDialogOpen: readonly(isDialogOpen),
    newId,
    errorMessage: readonly(errorMessage),
    characterUsage: readonly(characterUsage),
    hasError,
    dialogTitle,

    // メソッド
    validateId,
    openDialog,
    closeDialog,
    saveId,
    getItemTypeLabel,
  }
}
