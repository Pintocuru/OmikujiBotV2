<!-- src\ConfigMaker\components\displaySettings\CharacterPreview.vue -->
<template>
  <div class="relative card bg-base-100">
    <div class="card-body p-4 gap-4">
      <!-- メインプレビュー -->
      <div class="flex justify-center">
        <template v-if="bundleCharacters || !showCharacterPersistent">
          <CharacterAvatar
            :profile-image="firstCharacter?.image?.default"
            :character-name="firstCharacter?.displayName"
            :background-color="firstCharacter?.color?.backgroundColor"
            :showCharacterFrame="showCharacterFrame"
            :displaySize="displaySize"
            :style="{ filter: brightnessFilter }"
          />
        </template>
        <template v-else>
          <div v-for="character in displayCharacters" :key="character.id" class="-mx-8">
            <CharacterAvatar
              :profile-image="character?.image?.default"
              :character-name="character?.displayName"
              :background-color="character?.color?.backgroundColor"
              :showCharacterFrame="showCharacterFrame"
              :displaySize="displaySize"
              :style="{ filter: brightnessFilter }"
            />
          </div>
        </template>
      </div>

      <!-- 状態説明 -->
      <div class="flex justify-center">
        <span>{{ statusText }}</span>
      </div>

      <!-- サムネイル表示 -->
      <div v-if="showCharacterThumbnail" class="absolute bottom-4 right-4 z-50">
        <CharacterThumbnailsPreview :characters="thumbnailCharacters" :displaySize="displaySize" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import CharacterAvatar from '@/MainGenerator/components/OmikujiBot/CharacterAvatar.vue'
  import CharacterThumbnailsPreview from '@/MainGenerator/components/OmikujiBot/CharacterThumbnailsPreview.vue'
  import { DisplaySize } from '@shared/types/CommonSchema'

  const props = withDefaults(
    defineProps<{
      characters: Record<string, CharacterType>
      bundleCharacters: boolean
      showCharacterPersistent: boolean
      showCharacterFrame: boolean
      showCharacterThumbnail: boolean
      displaySize: DisplaySize
      maxDisplayCount?: number
    }>(),
    {
      maxDisplayCount: 5,
    }
  )

  const firstCharacter = computed(() => {
    const keys = Object.keys(props.characters)
    return keys.length > 0 ? props.characters[keys[0]] : null
  })

  const displayCharacters = computed(() =>
    Object.values(props.characters)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, props.maxDisplayCount)
  )

  const thumbnailCharacters = computed(() =>
    props.bundleCharacters ? (firstCharacter.value ? [firstCharacter.value] : []) : displayCharacters.value
  )

  const brightnessFilter = computed(() => (props.showCharacterPersistent ? 'brightness(60%)' : 'brightness(100%)'))

  const statusText = computed(() =>
    props.showCharacterPersistent ? '喋る時に画像が明るくなります' : '喋る時のみ表示されます'
  )
</script>
