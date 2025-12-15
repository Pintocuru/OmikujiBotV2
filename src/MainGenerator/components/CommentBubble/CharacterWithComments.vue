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
          :leave-motion="leaveMotion"
          :animated-text="character?.displayOption.isRpgVoice"
        />
      </div>

      <!-- キャラクターアバター -->
      <CharacterAvatar
        class="flex justify-center items-end"
        :profile-image="profileImage"
        :character-name="character?.displayName || character?.key || 'Character'"
        :background-color="character?.color?.backgroundColor"
        :show-character-frame="showCharacterFrame"
        :is-visible="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { CharacterType } from '@/types/'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterAvatar from './CharacterAvatar.vue'
  import { useViewBotCharacter } from './composables/useViewBotCharacter'
  import { DisplayBotMessage } from './composables/useBotDisplay'

  const props = defineProps<{
    character: CharacterType | null
    comments: DisplayBotMessage[]
    isActive: boolean
    profileImage: string[] | string | null
  }>()

  const emit = defineEmits<{
    removeComment: [messageId: string]
  }>()

  const { enterMotion, leaveMotion, showCharacterFrame } = useViewBotCharacter()

  const handleRemoveComment = (messageId: string) => {
    emit('removeComment', messageId)
  }
</script>
