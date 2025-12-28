<!-- src\ConfigMaker\components\componentEditor\bubble\CharacterAvatarPreview.vue -->
<template>
  <div class="flex flex-col md:flex-row justify-around gap-4 p-4 border rounded-lg border-base-200">
    <div class="flex-1 min-w-0">
      <div class="text-sm font-semibold mb-2 text-center text-secondary border-b border-secondary/50 pb-1">
        コメント時に表示するキャラクター
      </div>
      <div class="flex flex-col items-center">
        <div class="flex justify-center min-h-[50px]">
          <div v-if="zeroIndexCharacters.length === 0" class="text-gray-500 italic text-sm p-2">
            キャラクター設定されていません
          </div>
          <div v-for="character in zeroIndexCharacters" :key="character.key" class="-mx-4">
            <CharacterAvatar
              v-if="character.image?.default"
              :profile-image="character.image.default"
              :background-color="character.color?.backgroundColor"
              :showCharacterFrame="true"
              :characterSize="characterSize"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <div class="text-sm font-semibold mb-2 text-center text-primary border-b border-primary/50 pb-1">
        常時表示キャラクター
      </div>
      <div class="flex flex-col items-center">
        <div class="flex justify-center min-h-[50px]">
          <div v-if="displayCharacters.length === 0" class="text-gray-500 italic text-sm p-2">
            常時表示キャラクターが設定されていません
          </div>
          <div v-for="character in displayCharacters" :key="character.key" class="-mx-4">
            <CharacterAvatar
              v-if="character.image?.default"
              :profile-image="character.image.default"
              :background-color="character.color?.backgroundColor"
              :showCharacterFrame="false"
              :characterSize="characterSize"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="divider md:divider-horizontal my-0"></div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { BotMessage } from '@/types/MainGenerator/BotMessageSchema'
  import { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import CharacterAvatar from '@/MainGenerator/components/CommentBubble/CharacterAvatar.vue'
  import { useMessageFilterCore } from '@/MainGenerator/components/CommentBubble/composables/useMessageFilterCore'
  import { ShowCharacters } from '@/types'

  const props = defineProps<{
    characters: Record<string, CharacterType>
    showCharacters: ShowCharacters
    characterSize: number
  }>()

  const botMessages = ref<BotMessage[]>([])

  const { visibleCharacterGroups } = useMessageFilterCore(
    botMessages,
    computed(() => props.showCharacters)
  )

  const displayCharacters = computed(() => {
    const keys = visibleCharacterGroups.value.map((v) => v.characterKey)
    return keys.map((key) => props.characters[key]).filter(Boolean)
  })

  const zeroIndexCharacters = computed(() => {
    const centerGroup = props.showCharacters.center || []
    return centerGroup.map((key) => props.characters[key]).filter(Boolean)
  })
</script>
