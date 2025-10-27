<!-- src/MainGenerator/components/ToastBubbleItem.vue -->
<template>
  <div v-if="showToasts" :class="chatPositionClass" @click="handleClick">
    <!-- アイコン -->
    <div
      v-if="isCharacterDisplay && character && character.image?.default"
      class="chat-image avatar relative"
      :class="[SIZE_CONFIG[displaySize].avatar]"
    >
      <LayerImage :layers="character.image?.default" />
    </div>

    <!-- メッセージ内容 -->
    <div class="chat-bubble max-w-xs" :style="{ backgroundColor: botMessage?.color?.backgroundColor || '#CCC' }">
      <div
        class="leading-tight"
        :class="[sizeConfig.text]"
        :style="{ color: botMessage?.color?.textColor || '#212121' }"
      >
        {{ botMessage?.comment || simpleMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessage, CharacterType, getImagePath } from '@/types/'
  import { DisplaySize } from '@shared/types'
  import LayerImage from '@/common/LayerImage.vue'

  const props = withDefaults(
    defineProps<{
      botMessage?: BotMessage
      simpleMessage?: string
      showToastsOnRight?: boolean
      showToasts?: boolean
      character?: CharacterType | null
      isCharacterDisplay?: boolean
      displaySize?: DisplaySize
      clickable?: boolean
    }>(),
    {
      simpleMessage: 'error',
      showToastsOnRight: true,
      showToasts: true,
      isCharacterDisplay: true,
      displaySize: 'md',
      clickable: false,
    }
  )

  const emit = defineEmits(['click'])

  const SIZE_CONFIG = {
    xs: { text: 'text-xs', avatar: 'w-6 h-6' },
    sm: { text: 'text-sm', avatar: 'w-8 h-8' },
    md: { text: 'text-base', avatar: 'w-10 h-10' },
    lg: { text: 'text-lg', avatar: 'w-12 h-12' },
    xl: { text: 'text-xl', avatar: 'w-14 h-14' },
  } as const

  const sizeConfig = computed(() => SIZE_CONFIG[props.displaySize])

  const chatPositionClass = computed(() => (props.showToastsOnRight ? 'chat chat-end' : 'chat chat-start'))

  const handleClick = () => {
    if (props.clickable && props.botMessage) emit('click', props.botMessage.id)
  }
</script>

<style scoped>
  .avatar {
    position: relative;
  }
  .avatar img {
    object-fit: contain;
  }
</style>
