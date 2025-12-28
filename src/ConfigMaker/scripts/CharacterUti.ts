// src\ConfigMaker\scripts\CharacterUti.ts
import { storeToRefs } from 'pinia'
import { useOmikujiStore } from '../stores/useOmikujiStore'
import { computed } from 'vue'

/**
 * 各ライセンス状態を返す関数
 */
export function CharacterUtility() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const firstCharacter = computed(() => data.value.characters[Object.keys(data.value.characters)[0]])

  return { firstCharacter }
}
