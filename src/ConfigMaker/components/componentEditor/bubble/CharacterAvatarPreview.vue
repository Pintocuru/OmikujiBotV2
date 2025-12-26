<!-- src\ConfigMaker\components\componentEditor\bubble\CharacterAvatarPreview.vue -->
<template>
  <div class="flex flex-col md:flex-row justify-around gap-4 p-4 border rounded-lg border-base-200">
    <!-- コメントで表示する -->
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
  import { BotMessage } from '@/types/BotComponents/BotMessageSchema'
  import { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import CharacterAvatar from '@/MainGenerator/components/CommentBubble/CharacterAvatar.vue'
  import { useMessageFilterCore } from '@/MainGenerator/components/CommentBubble/composables/useMessageFilterCore'

  const props = defineProps<{
    characters: Record<string, CharacterType>
    showCharacters: string[][]
    characterSize: number
  }>()

  /**
   * プレビュー用なので空メッセージ
   */
  const botMessages = ref<BotMessage[]>([])

  /**
   * showCharacters はそのまま渡す
   */
  const { visibleCharacterGroups, zeroIndexMessages } = useMessageFilterCore(
    botMessages,
    computed(() => props.showCharacters)
  )

  /**
   * 表示キャラ決定
   * - 0番地があればそれ
   * - なければ visible groups
   */
  const displayCharacters = computed(() => {
    const keys =
      zeroIndexMessages.value.length > 0
        ? props.showCharacters[0]
        : visibleCharacterGroups.value.map((v) => v.characterKey)

    return keys.map((key) => props.characters[key]).filter(Boolean)
  })

  /**
   * 【追加】0番地専用の表示キャラ決定
   * - showCharacters[0]に設定されているキャラクター全てを返します
   */
  const zeroIndexCharacters = computed(() => {
    const zeroIndexGroup = props.showCharacters[0] || []
    return zeroIndexGroup.map((key) => props.characters[key]).filter(Boolean)
  })
</script>
