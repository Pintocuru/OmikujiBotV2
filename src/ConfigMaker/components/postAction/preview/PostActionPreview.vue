<!-- src\ConfigMaker\components\postAction\items\PostActionPreview.vue -->
<template>
  <div class="h-full flex flex-col items-center justify-center space-y-4">
    <!-- メッセージアクション -->
    <div v-if="action.actionType === 'message'" class="w-full">
      <!-- トースト -->
      <div v-if="isToast" @click="refreshToast" class="cursor-pointer">
        <ChatBubbleItem
          :key="toastKey"
          :simpleMessage="processedToastMessage"
          :showToastsOnRight="toastSettings.showToastsOnRight"
          :character="character"
          :iconKey="action.iconKey"
          :isCharacterDisplay="toastSettings.showToastsCharacter"
        />
      </div>

      <!-- フキダシ -->
      <div v-else class="space-y-8 flex flex-col items-center">
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
          :profileImage="characters[action.characterKey].image[action.iconKey]"
          :characterSize="bubbleSettings.characterSize"
          :showCharacterFrame="false"
        />
      </div>
    </div>

    <!-- WordPartyアクション -->
    <div v-else-if="action.actionType === 'wordParty'" class="w-full text-center">
      <PartyPopper :size="80" class="mx-auto text-purple-500" />
      <p class="text-sm opacity-70 mt-2">WordParty</p>
    </div>

    <!-- アクションセット -->
    <div v-else-if="action.actionType === 'actionSet'" class="w-full text-center">
      <MessagesSquare :size="80" class="mx-auto text-red-500" />
      <p class="text-sm opacity-70 mt-2">アクションセット</p>
    </div>

    <!-- テストボタン -->
    <div class="w-full text-center space-y-2">
      <WordPartyTestButton
        v-if="action.actionType === 'wordParty'"
        label="WordPartyのテスト実行"
        :pattern="action.wordParty"
      />
      <SoundTestButton
        v-if="action.actionType === 'sound' || action.actionType === 'message'"
        label="サウンドのテスト実行"
        :pattern="action.sound"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { defaultPlaceholdersShortLabels, PostActionType } from '@/types/'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { PlaceholderProcessor } from '@/MainGenerator/scripts/PlaceholderProcess/PlaceholderProcessor'
  import { PartyPopper, MessagesSquare } from 'lucide-vue-next'

  import CommentBubbleItem from '@/MainGenerator/components/CommentBubble/CommentBubbleItem.vue'
  import ChatBubbleItem from '@/MainGenerator/components/ToastWidgets/ToastBubbleItem.vue'
  import CharacterAvatar from '@/MainGenerator/components/CommentBubble/CharacterAvatar.vue'
  import WordPartyTestButton from '@/ConfigMaker/components/wordPartySettings/WordPartyTestButton.vue'
  import SoundTestButton from '@/ConfigMaker/components/wordPartySettings/SoundTestButton.vue'

  const props = defineProps<{ action: PostActionType }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const characters = computed(() => data.value.characters)
  const bubbleSettings = computed(() => data.value.displaySettings.components.bubble)
  const toastSettings = computed(() => data.value.displaySettings.components.toast)

  // プレースホルダー処理
  const processMessage = (message: string) => {
    const processor = new PlaceholderProcessor(data.value.placeholders)
    processor.updateResolvedValues(defaultPlaceholdersShortLabels)
    return processor.processText(message)
  }

  // キャラクター取得
  const character = computed(() => {
    if (props.action.actionType === 'message') {
      return characters.value[props.action.characterKey] || Object.values(characters.value)[0]
    }
    return Object.values(characters.value)[0]
  })

  // トースト表示判定
  const isToast = computed(() => props.action.actionType === 'message' && props.action.message.toast)

  // メッセージ処理
  const processedMessage = computed(() => {
    if (props.action.actionType !== 'message') return ''
    const content = props.action.message.bubble || '(未記入)'
    return processMessage(content)
  })

  const processedToastMessage = computed(() => {
    if (props.action.actionType !== 'message') return '(未記入)'
    const content = props.action.message.toast || '(未記入)'
    return processMessage(content)
  })

  // リフレッシュキー
  const messageKey = ref(0)
  const toastKey = ref(0)
  const refreshMessage = () => messageKey.value++
  const refreshToast = () => toastKey.value++
</script>
