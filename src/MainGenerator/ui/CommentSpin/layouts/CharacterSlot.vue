<!-- src/MainGenerator/ui/CommentSpin/layouts/CharacterSlot.vue -->
<template>
  <div
    class="shrink-0 rounded-lg overflow-hidden bg-base-300"
    :style="{ width: `${size * 4}px`, height: `${size * 4}px` }"
  >
    <LayerImage v-if="layers.length" :layers="layers" :size="size" :animation="animation" />
    <!-- キャラ未設定フォールバック -->
    <img v-else :src="fallbackAvatarUrl" class="w-full h-full object-cover" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { BotMessageBubbleType } from '@/types'
  import type { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import type { CharacterAnimationType } from '@/types/OmikujiData/CharacterSchema'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'

  const props = defineProps<{
    msg: BotMessageBubbleType
    characters: Record<string, CharacterType>
    size: number
  }>()

  const character = computed<CharacterType | null>(() => {
    const key = props.msg.bubble.characterKey
    return key ? (props.characters[key] ?? null) : null
  })

  // name を渡さなければ完全ランダム
  const fallbackAvatarUrl = computed(() => getAvatarUrl(props.msg?.bubble?.message ?? undefined))

  const imageEntry = computed(() => {
    if (!character.value) return null
    const iconKey = props.msg.bubble.iconKey || 'default'
    return character.value.image[iconKey] ?? character.value.image['default'] ?? null
  })

  const layers = computed<string[]>(() => imageEntry.value?.src ?? [])
  const animation = computed<CharacterAnimationType | undefined>(() => imageEntry.value?.animation)
</script>
