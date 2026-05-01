// src/common/LayerImage/useImageSources.ts
import { computed, ref, watch } from 'vue'
import { getImagePath } from '@/types'

export function useImageSources(layers: () => string[] | string) {
  const errorIndexes = ref(new Set<number>())

  const rawLayers = computed(() => (typeof layers() === 'string' ? [layers() as string] : (layers() as string[])))

  const sources = computed(() =>
    rawLayers.value
      .map((l, i) => ({ l, i }))
      .filter(({ l, i }) => l && !errorIndexes.value.has(i))
      .map(({ l }) => getImagePath(l))
  )

  const onError = (index: number) => {
    errorIndexes.value.add(index)
  }

  watch(rawLayers, () => errorIndexes.value.clear(), { deep: true })

  return { sources, onError }
}
