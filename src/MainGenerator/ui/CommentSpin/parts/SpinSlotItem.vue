<!-- src/MainGenerator/ui/CommentSpin/parts/SpinSlotItem.vue -->
<template>
  <div class="flex items-center justify-center gap-2 w-full h-full">
    <!-- 画像 (image / both) -->
    <LayerImage
      v-if="showImage && characterLayers.length"
      :layers="characterLayers"
      :size="14"
      :animation="characterAnimation"
    />
    <!-- フォールバック: キャラクター未設定時のアイコン -->
    <div
      v-else-if="showImage"
      class="w-14 h-14 rounded-full flex items-center justify-center text-2xl opacity-40"
      :class="`bg-${color.backTo} text-${color.backFrom}`"
    >
      ?
    </div>

    <!-- テキスト (text / both) -->
    <span
      v-if="showText"
      class="whitespace-nowrap font-bold tracking-wide"
      :class="[`text-${color.backTo}`, displayMode === 'both' ? 'text-2xl' : 'text-5xl']"
    >
      {{ msg.bubble.message }}
    </span>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { BotMessageBubbleType } from '@/types'
  import type { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import type { DaisyUiThemeFieldsType } from '@shared/styles/DaisyUiTheme'
  import type { SpinDisplayMode } from '@/types/OmikujiData/UiSettings/CommentSpinSchema'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'

  const props = defineProps<{
    msg: BotMessageBubbleType
    displayMode: SpinDisplayMode
    characters: Record<string, CharacterType>
    color: DaisyUiThemeFieldsType
  }>()

  const showImage = computed(() => props.displayMode === 'image' || props.displayMode === 'both')
  const showText = computed(() => props.displayMode === 'text' || props.displayMode === 'both')

  /** bubble.characterKey → CharacterType を解決 */
  const character = computed<CharacterType | null>(() => {
    const key = props.msg.bubble.characterKey
    return key ? (props.characters[key] ?? null) : null
  })

  /**
   * iconKey は感情キー（例: 'normal', 'happy'）。
   * CharacterImageSetSchema の後処理により image は
   * Record<string, { src: string[], label: string, animation? }> になっている。
   */
  const characterImageEntry = computed(() => {
    if (!character.value) return null
    const iconKey = props.msg.bubble.iconKey || 'normal'
    return character.value.image[iconKey] ?? character.value.image['normal'] ?? null
  })

  const characterLayers = computed<string[]>(() => characterImageEntry.value?.src ?? [])

  const characterAnimation = computed(() => characterImageEntry.value?.animation)
</script>
