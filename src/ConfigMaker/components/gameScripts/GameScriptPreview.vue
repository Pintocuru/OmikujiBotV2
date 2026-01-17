<!-- src\ConfigMaker\components\gameScripts\GameScriptPreview.vue -->
<template>
  <div class="h-full flex flex-col items-center justify-center space-y-4">
    <!-- メッセージアクション -->
    <div v-if="gameScripts && isValid" :key="gameScripts.scriptId" class="w-full">
      <!-- フキダシ -->
      <div class="space-y-8 flex flex-col items-center">
        <CommentBubbleItem
          :key="messageKey"
          :botName="isCharacter ? character.displayName : null"
          :message="processedMessage"
          :color="isCharacter ? character.color : bubbleSettings.defaultColor"
          @click="refreshMessage"
          class="cursor-pointer"
        />

        <LayerImage v-if="isCharacter" :layers="character.image?.default || ''" :size="bubbleSettings.characterSize" />
      </div>
    </div>
    <NoParamsCard v-else :message="`スクリプトID${isCharacter ? 'とキャラクターキー' : ''}を設定してください`" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { GameScriptsType } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  import CommentBubbleItem from '@/common/ui/CommentBubble/CommentBubbleItem.vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { GameScriptManager } from '@main/stores/GameScript/GameScriptManager'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'

  const props = defineProps<{
    gameScripts: GameScriptsType | null
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isCharacter } = useVisibilityAccess()
  const scriptManager = new GameScriptManager()

  const characters = computed(() => data.value.characters)
  const bubbleSettings = computed(() => data.value.components.bubble)

  // キャラクター取得
  const isValid = computed(() => {
    if (!props.gameScripts) return false
    if (props.gameScripts.scriptId === '') return false

    // キャラクター機能が有効な場合だけキャラチェック
    if (isCharacter.value) {
      return !!characters.value[props.gameScripts.characterKey]
    }

    // isCharacter = false の場合はキャラチェック不要
    return true
  })

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
