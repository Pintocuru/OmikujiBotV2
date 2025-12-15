<!-- src/MainGenerator/components/OmikujiBot/ViewBotMessage.vue -->
<template>
  <div class="relative h-screen">
    <!-- コメント表示エリア（元の位置と同じ） -->
    <div class="absolute w-full" :style="{ bottom: '440px' }">
      <CommentDisplay
        :displayed-comments="displayedComments"
        :remove-comment="removeComment"
        :enter-motion="enterMotion"
        :leave-motion="leaveMotion"
        :spacing="40"
      >
        <template #default="{ message, index }">
          <!-- キャラクター -->
          <CharacterAvatar
            class="absolute top-[80px] top-1/2 left-1/2 -translate-x-1/2 transform"
            :profile-image="message.profileImage"
            :character-name="message.name"
            :background-color="message.color?.backgroundColor"
            :show-character-frame="true"
            :is-visible="index === 0"
          />
        </template>
      </CommentDisplay>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterAvatar from './CharacterAvatar.vue'
  import { useBotDisplay } from './composables/useBotDisplay'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'
  import { storeToRefs } from 'pinia'

  // Piniaストアの使用
  const appStore = useAppStore()

  // リアクティブ変数
  const { botMessages } = storeToRefs(appStore)
  const bubble = computed(() => appStore.data.displaySettings?.components.bubble || {})

  // アニメーション設定
  const enterMotion = computed(() => bubble.value?.bubbleMotionEnter)
  const leaveMotion = computed(() => bubble.value?.bubbleMotionLeave)

  // キャラクター表示設定
  const showCharacterFrame = computed(() => bubble.value?.showCharacterFrame)

  // 基底composableを直接使用
  const { displayedComments, removeComment, start } = useBotDisplay(botMessages, 'comment')

  onMounted(() => start())
</script>
