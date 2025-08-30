<!-- src/MainGenerator/components/OmikujiBot/ViewBotCharacter.vue -->
<template>
  <!-- キャラクター横並び表示 -->
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
    <div
      v-for="(character, key) in availableCharacters"
      :key="key"
      class="relative pointer-events-auto -mx-4"
      :style="{
        zIndex: key === lastCommenterKey ? 50 : 0,
        filter: key === lastCommenterKey ? 'brightness(100%)' : 'brightness(60%)',
      }"
    >
      <!-- キャラクターアバター -->
      <div class="relative flex flex-col items-center">
        <CharacterAvatar
          class="flex justify-center items-end"
          :profile-image="getCharacterImage(character)"
          :character-name="character.displayName || key"
          :background-color="character.color?.backgroundColor"
          :show-character-frame="showCharacterFrame"
          :is-visible="true"
          :display-size="displaySize"
          @image-error="handleImageError(character)"
        />

        <!-- コメント表示 -->
        <CommentDisplay
          :displayed-comments="getCharacterComments(key)"
          :remove-comment="(messageId) => removeCommentWithIconReset(messageId, key)"
          :enter-motion="enterMotion"
          :leave-motion="leaveMotion"
          :text-size="displaySize"
          mode="persistent"
          :spacing="sizeConfig.spacing"
          :avatar-top="sizeConfig.avatarTop"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useDisplayStore } from '@/MainGenerator/stores'
  import { useViewBotCharacter } from './composables/useViewBotCharacter'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterAvatar from './CharacterAvatar.vue'

  // ディスプレイストアからdisplaySizeを取得
  const displayStore = useDisplayStore()
  const { displaySize } = storeToRefs(displayStore)

  // コンポーザブルを使用
  const {
    availableCharacters,
    enterMotion,
    leaveMotion,
    showCharacterFrame,
    sizeConfig,
    lastCommenterKey,
    getCharacterImage,
    getCharacterComments,
    removeCommentWithIconReset,
    handleImageError,
    start,
    stop,
  } = useViewBotCharacter()

  onMounted(() => start())
  onUnmounted(() => stop())
</script>
