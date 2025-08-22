<!-- src/MainGenerator/components/ViewBotToast.vue -->
<template>
  <div class="fixed right-4 z-999" :class="[sizeConfig.bottom]">
    <div
      v-for="(message, index) in displayedComments.slice().reverse()"
      :key="message.id"
      class="relative mt-1"
      :style="{ zIndex: displayedComments.length - index }"
    >
      <MotionWrapper
        v-model:visible="message.visible"
        :enter-motion="'slideLeft'"
        :leave-motion="'slideRight'"
        :auto-hide="false"
        @after-leave="() => removeComment(message.id)"
      >
        <div
          class="flex flex-row-reverse items-start w-full p-2 rounded-sm shadow-lg backdrop-blur-sm cursor-pointer hover:opacity-80 transition-opacity"
          :style="{
            backgroundColor: message.color?.backgroundColor || '#ffffff',
            maxWidth: sizeConfig.width,
            width: '100%',
          }"
          @click="hideComment(message.id)"
        >
          <!-- メッセージ内容 -->
          <div class="flex-1 min-w-0 px-1 overflow-hidden">
            <div
              class="break-words"
              :class="[sizeConfig.text]"
              :style="{
                color: message.color?.textColor || '#000000',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto',
              }"
            >
              {{ message.comment }}
            </div>
          </div>
        </div>
      </MotionWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useBotCommentDisplay } from '@/MainGenerator/components/OmikujiBot/useBotMessage'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
  import { storeToRefs } from 'pinia'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'

  // ストアから必要な情報を取得
  const appStore = useAppStore()
  const displayStore = useDisplayStore()
  const { botMessages } = storeToRefs(appStore)
  const { displaySize } = storeToRefs(displayStore)

  // サイズ設定の定数
  const SIZE_CONFIG = {
    xs: { bottom: 'bottom-10', text: 'text-xs leading-tight', avatar: 'w-6 h-6', width: '250px' },
    sm: { bottom: 'bottom-14', text: 'text-sm leading-tight', avatar: 'w-8 h-8', width: '300px' },
    md: { bottom: 'bottom-18', text: 'text-base leading-tight', avatar: 'w-10 h-10', width: '340px' },
    lg: { bottom: 'bottom-22', text: 'text-lg leading-tight', avatar: 'w-12 h-12', width: '380px' },
    xl: { bottom: 'bottom-26', text: 'text-xl leading-tight', avatar: 'w-14 h-14', width: '420px' },
  } as const

  // コメント表示ロジック（トースト用）
  const { displayedComments, removeComment, hideComment, start, stop } = useBotCommentDisplay(botMessages, 'toast')

  // サイズ設定の取得
  const sizeConfig = computed(() => SIZE_CONFIG[displaySize.value])

  onMounted(start)
  onUnmounted(stop)
</script>
