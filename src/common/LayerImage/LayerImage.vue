<!-- src/common/LayerImage/LayerImage.vue -->
<template>
  <div class="relative overflow-hidden" :class="[sizeClass, round && 'rounded-full', border && 'border']">
    <div v-if="variant" v-motion :initial="variant.initial" :visible="variant.visible" class="w-full h-full">
      <template v-if="sources.length">
        <img
          v-for="(src, i) in sources"
          :key="i"
          :src="src"
          class="absolute inset-0 object-contain"
          :style="{ zIndex: sources.length - i }"
          @error="onError(i)"
        />
      </template>
    </div>
    <template v-else-if="sources.length">
      <img
        v-for="(src, i) in sources"
        :key="i"
        :src="src"
        class="absolute inset-0 object-contain"
        :style="{ zIndex: sources.length - i }"
        @error="onError(i)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { CharacterAnimationType, getImagePath } from '@/types/'
  import { createLoopVariants } from '@/MainGenerator/scripts/MotionVariants/CharacterLoopMotion'

  const props = defineProps<{
    layers: string[] | string
    size?: number
    round?: boolean
    border?: boolean
    animation?: CharacterAnimationType
  }>()

  const errorIndexes = ref(new Set<number>())

  const rawLayers = computed(() => (typeof props.layers === 'string' ? [props.layers] : props.layers))

  const sources = computed(() =>
    rawLayers.value
      .map((l, i) => ({ l, i }))
      .filter(({ l, i }) => l && !errorIndexes.value.has(i))
      .map(({ l }) => getImagePath(l))
  )

  const onError = (index: number) => {
    errorIndexes.value.add(index)
  }

  const sizeClass = computed(() => `w-${props.size || 16} h-${props.size || 16}`)

  const variant = computed(() => {
    if (!props.animation || props.animation.type === 'none') return null
    return createLoopVariants({
      duration: props.animation.duration,
      loop: props.animation.loop,
    })[props.animation.type]
  })

  watch(
    () => rawLayers.value,
    () => {
      errorIndexes.value.clear()
    },
    { deep: true }
  )
</script>
