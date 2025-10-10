// src/ConfigMaker/components/rules/CharacterChanger/composables/useModalState.ts
import { ref, computed } from 'vue'

/**
 * キャラクター変更モーダルの状態管理
 */
export function useModalState() {
  const isModalOpen = ref(false)
  const characterMappings = ref<Record<string, string>>({})

  /**
   * モーダルを開く
   */
  const openModal = (initialMappings?: Record<string, string>) => {
    isModalOpen.value = true
    characterMappings.value = initialMappings || {}
  }

  /**
   * モーダルを閉じる
   */
  const closeModal = () => {
    isModalOpen.value = false
    characterMappings.value = {}
  }

  /**
   * すべてのマッピングをクリア
   */
  const clearAllMappings = () => {
    characterMappings.value = {}
  }

  /**
   * 変更があるかチェック
   */
  const hasChanges = computed(() => {
    return Object.values(characterMappings.value).some((value) => value !== '')
  })

  return {
    isModalOpen,
    characterMappings,
    openModal,
    closeModal,
    clearAllMappings,
    hasChanges,
  }
}
