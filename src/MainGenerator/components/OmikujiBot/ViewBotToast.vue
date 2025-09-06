<!-- src/MainGenerator/components/ViewBotToast.vue -->
<template>
  <div v-for="(message, index) in displayedComments.slice().reverse()" :key="message.id">
    <MotionWrapper
      v-model:visible="message.visible"
      :enter-motion="'slideLeft'"
      :leave-motion="'slideRight'"
      :auto-hide="false"
      @after-leave="() => removeComment(message.id)"
    >
      <div class="chat chat-end w-sm mx-auto" @click="hideComment(message.id)">
        <!-- アイコン -->
        <div class="chat-image avatar">
          <div class="w-10 rounded-full">
            <img
              alt="Tailwind CSS chat bubble component"
              :src="getImagePath(characters?.[message.characterKey]?.image?.default)"
            />
          </div>
        </div>

        <!-- メッセージ内容 -->
        <div
          class="chat-bubble"
          :style="{
            backgroundColor: message.color?.backgroundColor || '#CCC',
          }"
        >
          <div
            class="leading-tight"
            :class="[sizeConfig.text]"
            :style="{ color: message.color?.textColor || '#212121' }"
          >
            {{ message.comment }}
          </div>
        </div>
      </div>
    </MotionWrapper>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { getImagePath } from '@/types/'
  import { useBotDisplay } from './composables/useBotDisplay'
  import { useAppStore, useDisplayStore } from '@/MainGenerator/stores'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'
  import { storeToRefs } from 'pinia'

  // ストアから必要な情報を取得
  const appStore = useAppStore()
  const displayStore = useDisplayStore()
  const { botMessages } = storeToRefs(appStore)
  const { displaySize } = storeToRefs(displayStore)

  const characters = computed(() => appStore.characterCollector.getUsedCharacterData())

  // サイズ設定の定数
  const SIZE_CONFIG = {
    xs: { text: 'text-xs', avatar: 'w-6 h-6' },
    sm: { text: 'text-sm', avatar: 'w-8 h-8' },
    md: { text: 'text-base', avatar: 'w-10 h-10' },
    lg: { text: 'text-lg', avatar: 'w-12 h-12' },
    xl: { text: 'text-xl', avatar: 'w-14 h-14' },
  } as const

  // コメント表示ロジック
  const { displayedComments, removeComment, hideComment, start, stop } = useBotDisplay(botMessages, 'toast')

  // サイズ設定の取得
  const sizeConfig = computed(() => SIZE_CONFIG[displaySize.value])

  onMounted(start)
  onUnmounted(stop)
</script>
