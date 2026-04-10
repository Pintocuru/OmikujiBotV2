<!-- src/MainGenerator/ui/CommentSpin/layouts/CharacterSlot.vue -->
<template>
  <div class="shrink-0 rounded-lg overflow-hidden" :style="{ width: `${size * 4}px`, height: `${size * 4}px` }">
    <LayerImage2 v-if="layers.length" :layers="layers" :width="size * 4" :height="size * 4" :animation="animation" />
    <!-- キャラ未設定フォールバック -->
    <img v-else :src="fallbackAvatarUrl" class="w-full h-full object-cover" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { BotMessageBubbleType } from '@/types'
  import type { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import type { CharacterAnimationType } from '@/types/OmikujiData/CharacterSchema'
  import LayerImage2 from '@/common/LayerImage/LayerImage2.vue'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  const props = defineProps<{
    msg: BotMessageBubbleType
    size: number
  }>()

  const appStore = useAppStore()
  const characters = computed(() => appStore.data.characters)

  const character = computed<CharacterType | null>(() => {
    const key = props.msg.bubble.characterKey
    return key ? (characters.value[key] ?? null) : null
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
