// src/ConfigMaker/components/characters/CharacterImage/composables/useEmotionDraft.ts
import { ref, computed } from 'vue'
import type { CharacterImageType, CharacterAnimationType } from '@/types/'

export function useEmotionDraft(getModelValue: () => CharacterImageType) {
  const draftValue = ref<CharacterImageType>({})

  const initDraft = () => {
    draftValue.value = JSON.parse(JSON.stringify(getModelValue()))
  }

  const draftItemFor = (key: string | null) => computed(() => (key ? (draftValue.value[key] ?? null) : null))

  // ── 個別更新 ──────────────────────────────────────────────────────────────

  const updateSrc = (key: string, src: string[]) => {
    if (!draftValue.value[key]) return
    draftValue.value[key] = { ...draftValue.value[key], src }
  }

  const updateLabel = (key: string, label: string) => {
    if (!draftValue.value[key]) return
    draftValue.value[key] = { ...draftValue.value[key], label }
  }

  const updateAnimation = (key: string, animation: CharacterAnimationType | undefined) => {
    if (!draftValue.value[key]) return
    const { animation: _old, ...rest } = draftValue.value[key]
    draftValue.value[key] = animation ? { ...rest, animation } : { ...rest }
  }

  const removeKey = (key: string) => {
    delete draftValue.value[key]
  }

  return {
    draftValue,
    initDraft,
    draftItemFor,
    updateSrc,
    updateLabel,
    updateAnimation,
    removeKey,
  }
}
