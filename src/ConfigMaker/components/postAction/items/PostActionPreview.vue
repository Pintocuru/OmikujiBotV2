<!-- src\ConfigMaker\components\postAction\items\PostActionPreview.vue -->
<template>
  <div class="h-full flex items-center justify-center">
    <!-- メッセージプレビュー -->
    <div v-if="action.actionType === 'message'" class="w-full space-y-8">
      <CommentBubbleItem
        :name="character.name"
        :comment="displayedMessage"
        :color="character.color"
        @click="handleCommentClick"
        class="cursor-pointer"
      />
      <MotionWrapper :enter-motion="action.enterMotion" :auto-hide="false">
        <CharacterPreview
          :characters="characters"
          :characterKey="action.characterKey"
          :iconKey="action.iconKey"
          :showCharacterFrame="base.showCharacterFrame"
        />
      </MotionWrapper>
    </div>

    <!-- トーストプレビュー -->
    <div v-if="action.actionType === 'toast'" class="w-full">
      <ChatBubbleItem
        :botMessage="createToastMessage()"
        :showToastsOnRight="base.showToastsOnRight"
        :character="character"
      />
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
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { BotMessageSchema, PostActionType } from '@/types/'
  import CharacterPreview from '@/ConfigMaker/components/displaySettings/CharacterPreview.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import CommentBubbleItem from '@/MainGenerator/components/CommentBubble/CommentBubbleItem.vue'
  import ChatBubbleItem from '@/MainGenerator/components/ToastWidgets/ToastBubbleItem.vue'
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

  const refreshKey = ref(0)
  const displayedMessage = computed(() => {
    void refreshKey.value // 再計算を強制
    return processMessage()
  })

  // プレースホルダー置換
  const processMessage = () => {
    const placeProcess = new PlaceholderProcessor(data.value.placeholders)
    return placeProcess.processText(props.action.messageContent)
  }

  const handleCommentClick = () => {
    refreshKey.value++ // 再計算を強制
  }

  // 現在のキャラクター
  const character = computed(() => {
    const characterMap = characters.value
    return characterMap[props.action.characterKey] || Object.values(characterMap)[0]
  })

  // トーストメッセージの作成
  const createToastMessage = () => {
    if (!character.value) return undefined
    return BotMessageSchema.parse({
      color: character.value.color,
      comment: props.action.messageToast ?? '未記入',
    })
  }
</script>
