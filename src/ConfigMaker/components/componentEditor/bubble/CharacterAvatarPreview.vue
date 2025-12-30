<!-- src\ConfigMaker\components\componentEditor\bubble\CharacterAvatarPreview.vue -->
<template>
  <div class="flex flex-col md:flex-row justify-around gap-4 p-4 border rounded-lg border-base-200">
    <div class="flex-1 min-w-0">
      <div class="text-sm font-semibold mb-2 text-center text-secondary border-b border-secondary/50 pb-1">
        コメント時に表示するキャラクター
      </div>
      <div class="flex flex-col items-center">
        <div class="flex justify-center min-h-[50px]">
          <!-- キャラクターデータがない場合 -->
          <div v-if="!isCharacter" class="text-gray-500 italic text-sm p-2">キャラクターが存在しません</div>
          <div v-for="character in zeroIndexCharacters" :key="character.key" class="-mx-4">
            <!-- TODO: 「キャラクター画像が1枚もない」という値も欲しいな -->
            <!-- TODO: キャラクター画像が複数あるなら、ランダムで変更してもいいかもね -->
            <CharacterLayerImage :layers="character.image.default" :size="characterSize" :color="character.color" />
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
            <LayerImage :layers="character.image.default" :size="characterSize" />
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
  import CharacterLayerImage from '@/common/LayerImage/CharacterLayerImage.vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { useMessageFilter } from '@/common/CharacterManager/useMessageFilter'
  import { ShowCharacters } from '@/types'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useAccessCheckerConfig'

  const props = defineProps<{
    characters: Record<string, CharacterType>
    showCharacters: ShowCharacters
    characterSize: number
  }>()

  const { isCharacter } = useVisibilityAccess()

  const botMessages = ref<BotMessage[]>([])

  const { visibleCharacterGroups } = useMessageFilter(
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
