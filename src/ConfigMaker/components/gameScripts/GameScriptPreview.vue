<!-- C:\_root\_nodejs\OmikenTemplates\templates\OmikujiBot\src\ConfigMaker\components\gameScripts\GameScriptPreview.vue -->
<template>
  <div class="h-full flex flex-col items-center justify-center space-y-4">
    <!-- メッセージアクション -->
    <div v-if="gameScripts" class="w-full">
      <!-- フキダシ -->
      <div class="space-y-8 flex flex-col items-center">
        <CommentBubbleItem
          :key="messageKey"
          :botName="character.displayName"
          :message="processedMessage"
          :color="character.color"
          @click="refreshMessage"
          class="cursor-pointer"
        />
        <CharacterAvatar
          v-if="character.displayOption.isIconDisplay"
          :profileImage="characters[gameScripts.characterKey].image.default"
          :characterSize="bubbleSettings.characterSize"
          :showCharacterFrame="false"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { defaultPlaceholdersShortLabels, GameScriptsType } from '@/types/'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { PlaceholderProcessor } from '@/MainGenerator/scripts/PlaceholderProcess/PlaceholderProcessor'

  import CommentBubbleItem from '@/MainGenerator/components/CommentBubble/CommentBubbleItem.vue'
  import CharacterAvatar from '@/MainGenerator/components/CommentBubble/CharacterAvatar.vue'
  import { GameScriptManager } from '@/MainGenerator/scripts/GameScript/GameScriptManager'

  const props = defineProps<{
    gameScripts: GameScriptsType | null
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const characters = computed(() => data.value.characters)
  const bubbleSettings = computed(() => data.value.displaySettings.components.bubble)

  // プレースホルダー処理
  const processMessage = (message: string) => {
    const processor = new PlaceholderProcessor(data.value.placeholders)
    processor.updateResolvedValues(defaultPlaceholdersShortLabels)
    return processor.processText(message)
  }

  // キャラクター取得
  const character = computed(() => {
    if (props.gameScripts) {
      return characters.value[props.gameScripts.characterKey] || Object.values(characters.value)[0]
    }
    return Object.values(characters.value)[0]
  })

  // メッセージ処理
  const processedMessage = computed(() => {
    const _ = messageKey.value
    const scriptId = props.gameScripts?.scriptId
    if (!scriptId) return ''

    const scriptManager = new GameScriptManager()
    return scriptManager.playSampleScript(scriptId)
  })

  // リフレッシュキー
  const messageKey = ref(0)
  const refreshMessage = () => messageKey.value++
</script>
