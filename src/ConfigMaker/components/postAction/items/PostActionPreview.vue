<!-- src\ConfigMaker\components\postAction\items\PostActionPreview.vue -->
<template>
  <div class="h-full flex items-center justify-center p-4">
    <!-- メッセージプレビュー -->
    <div v-if="action.actionType === 'message'" class="w-full">
      <!-- TODO:プレースホルダーの解決 -->
      <CommentBubbleItem :name="character.name" :comment="action.messageContent" :color="character.color" />
      <!-- TODO:CharacterPreview ではなく新しいコンポーネントを作成したい -->
      <CharacterPreview :characters="characters" :characterKey="action.characterKey" />
    </div>

    <!-- トーストプレビュー -->
    <div v-if="action.actionType === 'toast'" class="w-full">
      <ChatBubbleItem
        :botMessage="createToastMessage()"
        :showToastsOnRight="showToastsOnRight"
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
  import { computed } from 'vue'
  import { BotMessageSchema, CharacterType, PostActionType } from '@/types/'
  import CommentBubbleItem from '@/MainGenerator/components/CommentBubble/CommentBubbleItem.vue'
  import CharacterPreview from '@/ConfigMaker/components/displaySettings/CharacterPreview.vue'
  import ChatBubbleItem from '@/MainGenerator/components/ToastWidgets/ToastBubbleItem.vue'
  import { PartyPopper, MessagesSquare } from 'lucide-vue-next'

  // Props
  const props = defineProps<{
    action: PostActionType
    characters: Record<string, CharacterType>
    showToastsOnRight: boolean
  }>()

  // 現在のキャラクター
  const character = computed(() => {
    return props.characters[props.action.characterKey] || Object.values(props.characters)[0]
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
