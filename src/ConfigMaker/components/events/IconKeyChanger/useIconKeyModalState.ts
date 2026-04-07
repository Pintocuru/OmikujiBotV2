// src/ConfigMaker/components/events/IconKeyChanger/useIconKeyModalState.ts
import { ref, computed } from 'vue'

/**
 * iconKey変更モーダルの状態管理
 * mappingsのキーは "characterKey:iconKey" 複合形式
 */
export function useIconKeyModalState() {
  const isModalOpen = ref(false)
  const iconKeyMappings = ref<Record<string, string>>({})

  const openModal = (initialMappings?: Record<string, string>) => {
    isModalOpen.value = true
    iconKeyMappings.value = initialMappings || {}
  }

  const updateMapping = (compositeKey: string, value: string) => {
    iconKeyMappings.value[compositeKey] = value
  }

  const closeModal = () => {
    isModalOpen.value = false
    iconKeyMappings.value = {}
  }

  const clearAllMappings = () => {
    iconKeyMappings.value = {}
  }

  const hasChanges = computed(() => {
    return Object.values(iconKeyMappings.value).some((value) => value !== '')
  })

  return {
    isModalOpen,
    iconKeyMappings,
    openModal,
    updateMapping,
    closeModal,
    clearAllMappings,
    hasChanges,
  }
}
