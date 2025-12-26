<!-- src\ConfigMaker\components\gameScripts\GameScriptPreview.vue -->
<template>
  <div class="h-full flex flex-col items-center justify-center space-y-4">
    <!-- メッセージアクション -->
    <div v-if="gameScripts && isValid" :key="gameScripts.scriptId" class="w-full">
      <!-- フキダシ -->
      <div class="space-y-8 flex flex-col items-center">
        <CommentBubbleItem
          v-if="character"
          :key="messageKey"
          :botName="character.displayName"
          :message="processedMessage"
          :color="character.color"
          @click="refreshMessage"
          class="cursor-pointer"
        />

        <CharacterAvatar
          :profileImage="character.image?.default || ''"
          :characterSize="bubbleSettings.characterSize"
          :showCharacterFrame="false"
        />
      </div>
    </div>
    <NoParamsCard v-else :message="'スクリプトIDとキャラクターキーを設定してください'" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { GameScriptsType } from '@/types/'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  import CommentBubbleItem from '@/MainGenerator/components/CommentBubble/CommentBubbleItem.vue'
  import CharacterAvatar from '@/MainGenerator/components/CommentBubble/CharacterAvatar.vue'
  import { GameScriptManager } from '@/MainGenerator/stores/GameScript/GameScriptManager'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'

  const props = defineProps<{
    gameScripts: GameScriptsType | null
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const scriptManager = new GameScriptManager()

  const characters = computed(() => data.value.characters)
  const bubbleSettings = computed(() => data.value.components.bubble)

  // キャラクター取得
  const isValid = computed(
    () => !!(props.gameScripts && props.gameScripts.scriptId !== '' && characters.value[props.gameScripts.characterKey])
  )

  const character = computed(() => {
    if (props.gameScripts) {
      return characters.value[props.gameScripts.characterKey]
    }
    return Object.values(characters.value)[0]
  })

  // メッセージ処理
  const processedMessage = computed(() => {
    const _ = messageKey.value
    const scriptId = props.gameScripts?.scriptId
    if (!scriptId) return ''

    return scriptManager.playSampleScript(scriptId, props.gameScripts?.queryString)
  })

  // リフレッシュキー
  const messageKey = ref(0)
  const refreshMessage = () => messageKey.value++
</script>
