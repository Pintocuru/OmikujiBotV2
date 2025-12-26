<!-- src/MainGenerator/components/ToastBubbleItem.vue -->
<template>
  <div :class="showToastsOnRight ? 'chat chat-end' : 'chat chat-start'" @click="handleClick">
    <!-- アイコン -->
    <div
      v-if="isCharacterDisplay && character && character.image?.[iconKey]"
      class="chat-image avatar relative w-10 h-10"
    >
      <LayerImage :layers="character.image?.[iconKey]" :size="10" :round="true" />
    </div>

    <!-- メッセージ -->
    <div
      v-if="resolvedMessage"
      :data-theme="color?.isTheme ? color.daisyUiTheme : null"
      class="chat-bubble max-w-xs"
      :class="
        color?.isTheme
          ? ['bg-gradient-to-br', `from-${color.backFrom}`, `to-${color.backTo}`, 'text-primary-content']
          : ''
      "
      :style="!color?.isTheme ? { backgroundColor: color?.backgroundColor || '#ccc' } : {}"
    >
      <div class="leading-tight text-base" :style="!color?.isTheme ? { color: color?.textColor || '#212121' } : {}">
        {{ resolvedMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessage, CharacterEmotionType, CharacterType } from '@/types'
  import { CharacterColorType } from '@/types/OmikujiData/CharacterSchema'
  import LayerImage from '@/common/LayerImage.vue'

  const props = withDefaults(
    defineProps<{
      botMessage?: BotMessage
      simpleMessage?: string
      showToastsOnRight?: boolean
      character: CharacterType | null
      iconKey?: CharacterEmotionType
      isCharacterDisplay?: boolean
      clickable?: boolean
    }>(),
    {
      iconKey: 'default',
      showToastsOnRight: true,
      isCharacterDisplay: true,
      clickable: false,
    }
  )

  const emit = defineEmits(['click'])

  const resolvedMessage = computed(() => {
    const toast = props.botMessage?.message?.toast
    if (typeof toast === 'string') {
      const t = toast.trim()
      return t !== '' ? t : null
    }
    return props.simpleMessage ?? null
  })

  const color = computed<CharacterColorType | undefined>(() => props.botMessage?.color || props.character?.color)

  const handleClick = () => {
    if (props.clickable && props.botMessage) {
      emit('click', props.botMessage.id)
    }
  }
</script>
