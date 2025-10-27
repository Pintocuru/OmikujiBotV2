<!-- src\ConfigMaker\components\postAction\items\PostActionPreview.vue -->
<template>
  <div class="h-full flex flex-col items-center justify-center space-y-4">
    <!-- メッセージプレビュー -->
    <div v-if="action.actionType === 'message'" class="w-full space-y-8 flex flex-col items-center">
      <CommentBubbleItem
        :key="`message-${messageRefreshKey}`"
        :name="character.displayName"
        :comment="processedMessage"
        :color="character.color"
        @click="handleMessageClick"
        class="cursor-pointer"
      />
      <MotionWrapper :key="`motion-${messageRefreshKey}`" :enter-motion="action.enterMotion" :auto-hide="false">
        <CharacterPreview
          v-if="character.image?.default && character.displayOption.isIconDisplay"
          :characters="characters"
          :characterKey="action.characterKey"
          :iconKey="action.iconKey"
          :showCharacterFrame="base.showCharacterFrame"
        />
      </MotionWrapper>
    </div>

    <!-- トーストプレビュー -->
    <div v-if="action.actionType === 'toast' && base.showToasts" class="w-full">
      <div class="cursor-pointer" @click="handleToastClick">
        <ChatBubbleItem
          :key="`toast-${toastRefreshKey}`"
          :botMessage="processedToastMessage"
          :showToastsOnRight="base.showToastsOnRight"
          :character="character"
          :isCharacterDisplay="base.showCharacterThumbnail"
        />
      </div>
    </div>

    <div v-if="action.actionType === 'toast' && !base.showToasts" class="w-full space-y-8 flex flex-col items-center">
      <CommentBubbleItem
        :key="`message-${messageRefreshKey}`"
        :name="character.displayName"
        :comment="processedToastMessage?.comment ?? '(未記入)'"
        :color="character.color"
        @click="handleMessageClick"
        class="cursor-pointer"
      />
      <MotionWrapper :key="`motion-${messageRefreshKey}`" :enter-motion="action.enterMotion" :auto-hide="false">
        <CharacterPreview
          v-if="character.image?.default && character.displayOption.isIconDisplay"
          :characters="characters"
          :characterKey="action.characterKey"
          iconKey="default"
          :showCharacterFrame="base.showCharacterFrame"
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
    <div v-if="action.actionType !== 'actionSet' && action.wordParty !== ''" class="w-full text-center">
      <WordPartyTestButton label="WordPartyのテスト実行" :pattern="action.wordParty" />
    </div>

    <!-- サウンドテストボタン -->
    <div v-if="action.actionType !== 'actionSet' && action.sound && action.sound !== ''" class="w-full text-center">
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

  // Props
  const props = defineProps<{
    action: PostActionType
  }>()

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const characters = computed(() => data.value.characters)
  const base = computed(() => data.value.displaySettings.base)

  // 各プレビュー用の独立したリフレッシュキー
  const messageRefreshKey = ref(0)
  const toastRefreshKey = ref(0)

  // 現在のキャラクター
  const character = computed(() => {
    const characterMap = characters.value
    return characterMap[props.action.characterKey] || Object.values(characterMap)[0]
  })

  // プレースホルダー置換処理（毎回新しいインスタンスを作成）
  const processMessage = (message: string) => {
    const placeProcess = new PlaceholderProcessor(data.value.placeholders)
    placeProcess.updateResolvedValues(defaultPlaceholdersShortLabels)
    return placeProcess.processText(message)
  }

  // メッセージプレビュー用の処理済みテキスト
  const processedMessage = computed(() => {
    void messageRefreshKey.value // 依存関係を明示
    const content = props.action.messageContent !== '' ? props.action.messageContent : '(未記入)'
    return processMessage(content)
  })

  // トーストプレビュー用の処理済みメッセージオブジェクト
  const processedToastMessage = computed(() => {
    void toastRefreshKey.value // 依存関係を明示
    if (!character.value) return undefined

    const content = props.action.messageToast ?? '(未記入)'
    const processedContent = processMessage(content)

    return BotMessageSchema.parse({
      color: character.value.color,
      comment: processedContent,
    })
  })

  // クリックハンドラー（それぞれ独立）
  const handleMessageClick = () => {
    messageRefreshKey.value++
  }

  const handleToastClick = () => {
    toastRefreshKey.value++
  }
</script>
