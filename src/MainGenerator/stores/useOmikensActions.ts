// src/MainGenerator/stores/useOmikensActions.ts
import { ref, computed } from 'vue'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

export const useOmikensActions = () => {
  const omikensMap = ref<Map<string, OmikenCommentType>>(new Map())

  const omikens = computed<OmikenCommentType[]>(() => [...omikensMap.value.values()])

  /**
   * 新規コメントのみ追加し、追加分だけを返す
   */
  const addOmikens = (incoming: OmikenCommentType[]): OmikenCommentType[] => {
    const newOmikens = incoming.filter((o) => !omikensMap.value.has(o.id))
    if (!newOmikens.length) return []

    const next = new Map(omikensMap.value)
    for (const o of newOmikens) next.set(o.id, o)
    omikensMap.value = next

    return newOmikens
  }

  const clearOmikens = () => {
    omikensMap.value = new Map()
  }

  return {
    omikens,

    addOmikens,
    clearOmikens,
  }
}
