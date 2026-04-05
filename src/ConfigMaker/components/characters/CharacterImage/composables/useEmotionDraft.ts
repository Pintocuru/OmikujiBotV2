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

  // ── 差分計算 ──────────────────────────────────────────────────────────────

  type DiffResult = {
    removed: string[]
    srcChanged: { key: string; src: string[] }[]
    labelChanged: { key: string; label: string }[]
    animationChanged: { key: string; animation: CharacterAnimationType | undefined }[]
  }

  const buildDiff = (): DiffResult => {
    const original = getModelValue()
    const result: DiffResult = {
      removed: [],
      srcChanged: [],
      labelChanged: [],
      animationChanged: [],
    }

    // 削除されたキー
    for (const key of Object.keys(original)) {
      if (!(key in draftValue.value)) {
        result.removed.push(key)
      }
    }

    // 変更・追加されたキー
    for (const [key, item] of Object.entries(draftValue.value)) {
      const orig = original[key]

      if (!orig || JSON.stringify(orig.src) !== JSON.stringify(item.src)) {
        result.srcChanged.push({ key, src: item.src })
      }

      if (!orig || orig.label !== item.label) {
        result.labelChanged.push({ key, label: item.label ?? '' })
      }

      const origAnim = orig?.animation
      const draftAnim = item.animation
      if (JSON.stringify(origAnim) !== JSON.stringify(draftAnim)) {
        result.animationChanged.push({ key, animation: draftAnim })
      }
    }

    return result
  }

  return {
    draftValue,
    initDraft,
    draftItemFor,
    updateSrc,
    updateLabel,
    updateAnimation,
    removeKey,
    buildDiff,
  }
}
