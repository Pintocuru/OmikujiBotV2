<!-- src/MainGenerator/ui/CommentSpin/parts/CharacterSlot.vue -->
<template>
  <div
    class="shrink-0 rounded-lg overflow-hidden bg-base-300"
    :style="{ width: `${size * 4}px`, height: `${size * 4}px` }"
  >
    <LayerImage v-if="layers.length" :layers="layers" :size="size" :animation="animation" />
    <!-- キャラ未設定フォールバック -->
    <div v-else class="w-full h-full flex items-center justify-center text-base-content/30 text-2xl">?</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { BotMessageBubbleType } from '@/types'
  import type { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import type { CharacterAnimationType } from '@/types/OmikujiData/CharacterSchema'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'

  const props = defineProps<{
    msg: BotMessageBubbleType
    characters: Record<string, CharacterType>
    size: number
  }>()

  const character = computed<CharacterType | null>(() => {
    const key = props.msg.bubble.characterKey
    return key ? (props.characters[key] ?? null) : null
  })

  const imageEntry = computed(() => {
    if (!character.value) return null
    const iconKey = props.msg.bubble.iconKey || 'normal'
    return character.value.image[iconKey] ?? character.value.image['normal'] ?? null
  })

  const layers = computed<string[]>(() => imageEntry.value?.src ?? [])
  const animation = computed<CharacterAnimationType | undefined>(() => imageEntry.value?.animation)
</script>
