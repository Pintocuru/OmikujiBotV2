<!-- src/MainGenerator/components/ToastBubbleItem.vue -->
<template>
  <div v-if="showToasts" :class="chatPositionClass" @click="handleClick">
    <!-- アイコン -->
    <div v-if="isCharacterDisplay && character" class="chat-image avatar relative w-10 h-10">
      <LayerImage :layers="character.image?.[iconKey]" :size="10" :round="true" />
    </div>

    <!-- メッセージ内容 -->
    <div
      class="chat-bubble max-w-xs"
      :style="{ backgroundColor: botMessage?.color?.backgroundColor || character?.color.backgroundColor || '#CCC' }"
    >
      <div
        class="leading-tight text-base"
        :style="{ color: botMessage?.color?.textColor || character?.color.textColor || '#212121' }"
      >
        {{ botMessage?.comment?.toast || simpleMessage }}
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
      showToasts?: boolean
      character?: CharacterType | null
      iconKey?: CharacterEmotionType
      isCharacterDisplay?: boolean
      clickable?: boolean
    }>(),
    {
      simpleMessage: 'error',
      iconKey: 'default',
      showToastsOnRight: true,
      showToasts: true,
      isCharacterDisplay: true,
      clickable: false,
    }
  )

  const emit = defineEmits(['click'])

  const chatPositionClass = computed(() => (props.showToastsOnRight ? 'chat chat-end' : 'chat chat-start'))

  const handleClick = () => {
    if (props.clickable && props.botMessage) emit('click', props.botMessage.id)
  }
</script>

<style scoped>
  .avatar img {
    object-fit: contain;
  }
</style>
