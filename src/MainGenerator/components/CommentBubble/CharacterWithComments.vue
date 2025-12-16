<!-- src\MainGenerator\components\CommentBubble\CharacterWithComments.vue -->
<template>
  <div
    class="relative pointer-events-auto"
    :style="{
      zIndex: isActive ? 50 : 0,
      filter: isActive ? 'brightness(100%)' : 'brightness(60%)',
    }"
  >
    <div class="relative flex flex-col items-center">
      <!-- コメント表示（アバターより上に配置） -->
      <div class="absolute bottom-full mb-[200px] w-full">
        <CommentDisplay
          :displayed-comments="comments"
          :remove-comment="handleRemoveComment"
          :enter-motion="enterMotion"
          :leave-motion="enterMotion"
          :animated-text="character?.displayOption.isRpgVoice"
          :show-toast-fallback="showToastFallback"
        />
      </div>

      <!-- キャラクターアバター -->
      <CharacterAvatar
        v-if="profileImage"
        class="flex justify-center items-end"
        :profileImage="profileImage"
        :characterName="character?.displayName || character?.key"
        :backgroundColor="character?.color?.backgroundColor"
        :showCharacterFrame="false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { CharacterType } from '@/types/'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterAvatar from './CharacterAvatar.vue'
  import { useViewBotCharacter } from './composables/useViewBotCharacter'
  import { DisplayBotMessage } from './composables/useBotDisplay'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  const props = defineProps<{
    character: CharacterType | null
    comments: DisplayBotMessage[]
    isActive: boolean
    profileImage: string[] | string | null
  }>()

  const emit = defineEmits<{
    removeComment: [messageId: string]
  }>()

  const { enterMotion } = useViewBotCharacter()

  const handleRemoveComment = (messageId: string) => {
    emit('removeComment', messageId)
  }

  // ★ toast専用コンポーネントが無効な場合、toastをフォールバック表示 ★
  const appStore = useAppStore()
  const conditions = computed(() => appStore.data.displaySettings?.components?.conditions || [])
  const showToastFallback = computed(() => !conditions.value.includes('toast'))
</script>
