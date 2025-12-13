<!-- src\ConfigMaker\components\postAction\items\PostActionPreview.vue -->
<template>
  <div class="h-full flex flex-col items-center justify-center space-y-4">
    <!-- メッセージプレビュー -->
    <div v-if="action.actionType === 'message'" class="w-full space-y-8 flex flex-col items-center">
      <CommentBubbleItem
        :key="`message-${messageRefreshKey}`"
        :botName="character.displayName"
        :comment="processedMessage"
        :color="character.color"
        @click="handleMessageClick"
        class="cursor-pointer"
      />
      <MotionWrapper :key="`motion-${messageRefreshKey}`" :initialMotion="action.enterMotion" :auto-hide="false">
        <CharacterPreview
          v-if="character.image?.default && character.displayOption.isIconDisplay"
          :characters="characters"
          :characterKey="action.characterKey"
          :iconKey="action.iconKey"
          :showCharacterFrame="bubbleSettings.showCharacterFrame"
        />
      </MotionWrapper>
    </div>

    <!-- トーストプレビュー -->
    <div v-if="action.actionType === 'toast' && toastSettings.showToastsOnRight" class="w-full">
      <div class="cursor-pointer" @click="handleToastClick">
        <ChatBubbleItem
          :key="`toast-${toastRefreshKey}`"
          :botMessage="processedToastMessage"
          :showToastsOnRight="toastSettings.showToastsOnRight"
          :character="character"
          :isCharacterDisplay="toastSettings.showThumbnail.length > 0"
        />
      </div>
    </div>

    <div
      v-if="action.actionType === 'toast' && !toastSettings.showToastsOnRight"
      class="w-full space-y-8 flex flex-col items-center"
    >
      <CommentBubbleItem
        :key="`message-${messageRefreshKey}`"
        :botName="character.displayName"
        :comment="processedToastMessage?.comment ?? '(未記入)'"
        :color="character.color"
        @click="handleMessageClick"
        class="cursor-pointer"
      />
      <MotionWrapper :key="`motion-${messageRefreshKey}`" :initialMotion="action.enterMotion" :auto-hide="false">
        <CharacterPreview
          v-if="character.image?.default && character.displayOption.isIconDisplay"
          :characters="characters"
          :characterKey="action.characterKey"
          iconKey="default"
          :showCharacterFrame="bubbleSettings.showCharacterFrame"
        />
      </MotionWrapper>
      (設定により、トーストはフキダシに置き換えされます)
    </div>

    <!-- WordPartyプレビュー -->
    <div v-if="action.actionType === 'wordParty'" class="w-full text-center">
      <PartyPopper :size="80" class="mx-auto text-purple-500" />
      <p class="text-sm opacity-70 mt-2">WordParty</p>
    </div>

    <!-- アクションセットプレビュー -->
    <div v-if="action.actionType === 'actionSet'" class="w-full text-center">
      <MessagesSquare :size="80" class="mx-auto text-red-500" />
      <p class="text-sm opacity-70 mt-2">アクションセット</p>
    </div>

    <!-- WordPartyテストボタン -->
    <div v-if="action.actionType === 'wordParty' && action.wordParty !== ''" class="w-full text-center">
      <WordPartyTestButton label="WordPartyのテスト実行" :pattern="action.wordParty" />
    </div>

    <!-- サウンドテストボタン -->
    <div
      v-if="
        (action.actionType === 'sound' && action.sound !== '') ||
        (action.actionType === 'message' && action.sound !== '')
      "
      class="w-full text-center"
    >
      <SoundTestButton label="サウンドのテスト実行" :pattern="action.sound" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { BotMessageSchema, defaultPlaceholdersShortLabels, PostActionType } from '@/types/'
  import CharacterPreview from '@/ConfigMaker/components/displaySettings/CharacterPreview.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import CommentBubbleItem from '@/MainGenerator/components/CommentBubble/CommentBubbleItem.vue'
  import ChatBubbleItem from '@/MainGenerator/components/ToastWidgets/ToastBubbleItem.vue'
  import WordPartyTestButton from '@/ConfigMaker/components/wordPartySettings/WordPartyTestButton.vue'
  import SoundTestButton from '@/ConfigMaker/components/wordPartySettings/SoundTestButton.vue'
  import { PartyPopper, MessagesSquare } from 'lucide-vue-next'
  import { storeToRefs } from 'pinia'
  import { PlaceholderProcessor } from '@/MainGenerator/scripts/PlaceholderProcess/PlaceholderProcessor'
  import MotionWrapper from '@MainScripts/MotionVariants/MotionWrapper.vue'

  const props = defineProps<{ action: PostActionType }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const characters = computed(() => data.value.characters)

  // 新しいスキーマに合わせて参照を変更
  const bubbleSettings = computed(() => data.value.displaySettings.components.bubble)
  const toastSettings = computed(() => data.value.displaySettings.components.toast)

  const messageRefreshKey = ref(0)
  const toastRefreshKey = ref(0)

  const character = computed(() => {
    const characterMap = characters.value
    return characterMap[props.action.characterKey] || Object.values(characterMap)[0]
  })

  const processMessage = (message: string) => {
    const placeProcess = new PlaceholderProcessor(data.value.placeholders)
    placeProcess.updateResolvedValues(defaultPlaceholdersShortLabels)
    return placeProcess.processText(message)
  }

  const processedMessage = computed(() => {
    void messageRefreshKey.value
    const content = props.action.messageContent !== '' ? props.action.messageContent : '(未記入)'
    return processMessage(content)
  })

  const processedToastMessage = computed(() => {
    void toastRefreshKey.value
    if (!character.value) return undefined

    const content = props.action.messageToast ?? '(未記入)'
    const processedContent = processMessage(content)

    return BotMessageSchema.parse({
      color: character.value.color,
      comment: processedContent,
    })
  })

  const handleMessageClick = () => {
    messageRefreshKey.value++
  }

  const handleToastClick = () => {
    toastRefreshKey.value++
  }
</script>
