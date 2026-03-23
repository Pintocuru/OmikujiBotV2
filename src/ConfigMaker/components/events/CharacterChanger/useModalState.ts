// src/ConfigMaker/components/events/CharacterChanger/useModalState.ts
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
   * マッピングを更新
   */
  const updateMapping = (charKey: string, value: string) => {
    characterMappings.value[charKey] = value
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
    updateMapping,
    closeModal,
    clearAllMappings,
    hasChanges,
  }
}
