<!-- src\ConfigMaker\components\displaySettings\CharacterPreview.vue -->
<template>
  <!-- メインプレビュー -->
  <div class="flex justify-center">
    <template v-if="bundleCharacters || !showCharacterPersistent">
      <CharacterAvatar
        :profile-image="character?.image?.[iconKey]"
        :character-name="character?.displayName"
        :background-color="character?.color?.backgroundColor"
        :showCharacterFrame="showCharacterFrame"
        :displaySize="displaySize"
        :style="{ filter: brightnessFilter }"
      />
    </template>
    <template v-else>
      <div v-for="character in displayCharacters" :key="character.id" class="-mx-4">
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
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CharacterEmotionType, CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import CharacterAvatar from '@/MainGenerator/components/CommentBubble/CharacterAvatar.vue'
  import { DisplaySize } from '@shared/types/CommonSchema'

  const props = withDefaults(
    defineProps<{
      characters: Record<string, CharacterType>
      characterKey?: string | null
      iconKey?: CharacterEmotionType
      bundleCharacters?: boolean
      showCharacterPersistent?: boolean
      showCharacterFrame?: boolean
      showCharacterThumbnail?: boolean
      displaySize?: DisplaySize
      maxDisplayCount?: number
    }>(),
    {
      characterKey: null,
      iconKey: 'default',
      bundleCharacters: false,
      showCharacterPersistent: false,
      showCharacterFrame: true,
      showCharacterThumbnail: true,
      displaySize: 'md',
      maxDisplayCount: 5,
    }
  )

  const character = computed(() => {
    const keys = Object.keys(props.characters)
    if (keys.length === 0) return null

    const key =
      typeof props.characterKey === 'string' && props.characterKey in props.characters ? props.characterKey : keys[0]

    return props.characters[key]
  })

  const displayCharacters = computed(() =>
    Object.values(props.characters)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .slice(0, props.maxDisplayCount)
  )

  const brightnessFilter = computed(() => (props.showCharacterPersistent ? 'brightness(60%)' : 'brightness(100%)'))
</script>
