<!-- src/MainGenerator/components/ToastBubbleItem.vue -->
<template>
  <div :class="chatPositionClass" @click="handleClick">
    <!-- アイコン -->
    <div
      v-if="isCharacterDisplay && character && character.image?.[iconKey]"
      class="chat-image avatar relative w-10 h-10"
    >
      <LayerImage :layers="character.image?.[iconKey]" :size="10" :round="true" />
    </div>

    <!-- メッセージ内容 -->
    <div
      v-if="resolvedMessage"
      class="chat-bubble max-w-xs"
      :style="{ backgroundColor: botMessage?.color?.backgroundColor || character?.color.backgroundColor || '#CCC' }"
    >
      <div
        class="leading-tight text-base"
        :style="{ color: botMessage?.color?.textColor || character?.color.textColor || '#212121' }"
      >
        {{ resolvedMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessage, CharacterEmotionType, CharacterType } from '@/types/'
  import LayerImage from '@/common/LayerImage.vue'

  const props = withDefaults(
    defineProps<{
      botMessage?: BotMessage
      simpleMessage?: string
      showToastsOnRight?: boolean
      character?: CharacterType | null
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

  /**
   * 表示ルール
   * - toast が string かつ空でない → toast を表示
   * - toast が "" / 空白 → 表示しない
   * - toast が null / undefined → simpleMessage を表示
   */
  const resolvedMessage = computed(() => {
    const toast = props.botMessage?.comment?.toast

    if (typeof toast === 'string') {
      const t = toast.trim()
      return t !== '' ? t : null
    }

    return props.simpleMessage ?? null
  })

  const chatPositionClass = computed(() => (props.showToastsOnRight ? 'chat chat-end' : 'chat chat-start'))

  const handleClick = () => {
    if (props.clickable && props.botMessage) {
      emit('click', props.botMessage.id)
    }
  }
</script>

<style scoped>
  .avatar img {
    object-fit: contain;
  }
</style>
