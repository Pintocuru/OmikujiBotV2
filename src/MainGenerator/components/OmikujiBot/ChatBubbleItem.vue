<!-- src/MainGenerator/components/ChatBubbleItem.vue -->
<template>
  <div v-if="message" class="chat chat-end w-sm mx-auto" @click="handleClick">
    <!-- アイコン -->
    <div class="chat-image avatar">
      <div class="rounded-full" :class="[SIZE_CONFIG[displaySize].avatar]">
        <img :src="getImagePath(character?.image?.default)" />
      </div>
    </div>

    <!-- メッセージ内容 -->
    <div
      class="chat-bubble"
      :style="{
        backgroundColor: message.color?.backgroundColor || '#CCC',
      }"
    >
      <div class="leading-tight" :class="[sizeConfig.text]" :style="{ color: message.color?.textColor || '#212121' }">
        {{ message.comment }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessage, CharacterType, getImagePath } from '@/types/'
  import { DisplaySize } from '@shared/types'

  const props = withDefaults(
    defineProps<{
      message: BotMessage | null
      character?: CharacterType
      displaySize?: DisplaySize
      clickable?: boolean
    }>(),
    {
      clickable: false,
      displaySize: 'md',
    }
  )

  const emit = defineEmits(['click'])

  // サイズ設定の定数
  const SIZE_CONFIG = {
    xs: { text: 'text-xs', avatar: 'w-6 h-6' },
    sm: { text: 'text-sm', avatar: 'w-8 h-8' },
    md: { text: 'text-base', avatar: 'w-10 h-10' },
    lg: { text: 'text-lg', avatar: 'w-12 h-12' },
    xl: { text: 'text-xl', avatar: 'w-14 h-14' },
  } as const

  // サイズ設定の取得
  const sizeConfig = computed(() => SIZE_CONFIG[props.displaySize])

  const handleClick = () => {
    if (props.clickable && props.message) {
      emit('click', props.message.id)
    }
  }
</script>
