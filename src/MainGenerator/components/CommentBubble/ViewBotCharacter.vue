<!-- src/MainGenerator/components/OmikujiBot/ViewBotCharacter.vue -->
<template>
  <!-- キャラクター表示 -->
  <div class="absolute bottom-0 left-0 right-0 flex justify-center items-end">
    <!-- bundleCharacters が true の場合は統合表示 -->
    <template v-if="bundleCharacters">
      <div
        class="relative pointer-events-auto"
        :style="{
          zIndex: hasActiveComments ? 50 : 0,
          filter: hasActiveComments ? 'brightness(100%)' : 'brightness(60%)',
        }"
      >
        <!-- 統合キャラクターアバター -->
        <div class="relative flex flex-col items-center">
          <!-- すべてのコメント表示（アバターより上に配置） -->
          <div class="absolute bottom-full mb-[200px] w-full">
            <CommentDisplay
              :displayed-comments="allDisplayedComments"
              :remove-comment="removeCommentWithIconReset"
              :enter-motion="enterMotion"
              :leave-motion="leaveMotion"
              :text-size="displaySize"
              :spacing="sizeConfig.spacing"
            />
          </div>

          <!-- 統合キャラクターアバター（最初のキャラクター） -->
          <CharacterAvatar
            class="flex justify-center items-end"
            :profile-image="getBundledCharacterImage()"
            :character-name="firstCharacter?.displayName || 'Character'"
            :background-color="firstCharacter?.color?.backgroundColor"
            :show-character-frame="showCharacterFrame"
            :is-visible="true"
            :display-size="displaySize"
          />
        </div>
      </div>
    </template>

    <!-- bundleCharacters が false の場合は個別表示 -->
    <template v-else>
      <div
        v-for="character in availableCharacters"
        :key="character.key"
        class="relative pointer-events-auto -mx-4"
        :style="{
          zIndex: character.key === lastCommenterKey ? 50 : 0,
          filter: character.key === lastCommenterKey ? 'brightness(100%)' : 'brightness(60%)',
        }"
      >
        <!-- キャラクターアバター -->
        <div class="relative flex flex-col items-center">
          <!-- コメント表示（アバターより上に配置） -->
          <div class="absolute bottom-full mb-[200px] w-full">
            <CommentDisplay
              :displayed-comments="getCharacterComments(character.key)"
              :remove-comment="(messageId) => removeCommentWithIconReset(messageId, character.key)"
              :enter-motion="enterMotion"
              :leave-motion="leaveMotion"
              :text-size="displaySize"
              :spacing="sizeConfig.spacing"
            />
          </div>

          <!-- キャラクターアバター（下層） -->
          <CharacterAvatar
            class="flex justify-center items-end"
            :profile-image="getCharacterImage(character)"
            :character-name="character.displayName || character.key"
            :background-color="character.color?.backgroundColor"
            :show-character-frame="showCharacterFrame"
            :is-visible="true"
            :display-size="displaySize"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted, computed } from 'vue'
  import CommentDisplay from './CommentDisplay.vue'
  import CharacterAvatar from './CharacterAvatar.vue'
  import { useViewBotCharacter } from './composables/useViewBotCharacter'
  import { useDisplayStore } from '@/MainGenerator/stores/useDisplayStore'
  import { storeToRefs } from 'pinia'

  // ディスプレイストアからdisplaySizeを取得
  const displayStore = useDisplayStore()
  const { displaySize } = storeToRefs(displayStore)

  // コンポーザブルを使用
  const {
    availableCharacters,
    enterMotion,
    leaveMotion,
    showCharacterFrame,
    bundleCharacters,
    sizeConfig,
    lastCommenterKey,
    getCharacterImage,
    getCharacterComments,
    removeCommentWithIconReset,
    displayedComments,
    start,
    stop,
  } = useViewBotCharacter()

  // 統合モード用の計算済みプロパティ
  const firstCharacter = computed(() => {
    const characterArray = Object.values(availableCharacters.value)
    if (characterArray.length === 0) return null
    // orderでソートして最初のキャラクターを取得
    return characterArray.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))[0]
  })

  // 統合モードでのキャラクター画像取得
  const getBundledCharacterImage = () => {
    if (!firstCharacter.value) return null

    const key = lastCommenterKey.value
    if (key) {
      const activeCharacter = availableCharacters.value.find((c) => c.key === key)
      if (activeCharacter) return getCharacterImage(activeCharacter)
    }

    return getCharacterImage(firstCharacter.value)
  }

  // 統合モード用のすべてのコメント
  const allDisplayedComments = computed(() => {
    return displayedComments.value.filter((comment) => comment.visible)
  })

  // 統合モードでアクティブなコメントがあるかどうか
  const hasActiveComments = computed(() => {
    return allDisplayedComments.value.length > 0
  })

  onMounted(() => start())
  onUnmounted(() => stop())
</script>
