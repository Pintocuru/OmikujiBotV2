<!-- src/ConfigMaker/components/postAction/preview/PostActionPreview.vue -->
<template>
  <div class="h-full flex flex-col items-center justify-center space-y-4">
    <!-- メッセージアクション -->
    <div v-if="action.actionType === 'message'" class="w-full">
      <!-- フキダシ -->
      <div v-if="!enableSecondary || action.message.isToast !== true" class="space-y-8 flex flex-col items-center">
        <CommentBubbleItem
          :key="messageKey"
          :botName="character ? character.displayName : null"
          :message="processedMessage"
          :color="character ? character.color : commonStyle.defaultColor"
          @click="refreshMessage"
          class="cursor-pointer"
        />
        <LayerImage
          v-if="isCharacter"
          :layers="character?.image?.[action.iconKey]?.src ?? []"
          :size="bubbleSettings.characterSize"
          :animation="character?.image?.[action.iconKey]?.animation"
        />
      </div>
      <!-- トースト -->

      <div v-else @click="refreshMessage" class="cursor-pointer">
        <ToastBubbleItem
          :key="messageKey"
          :message="processedMessage"
          :color="character ? character.color : commonStyle.defaultColor"
          :iconLayers="character?.image?.[action.iconKey]?.src ?? []"
          :showToastsOnRight="toastSettings.showToastsOnRight"
        />
      </div>
    </div>

    <!-- サウンドアクション -->
    <div v-else-if="action.actionType === 'sound'" class="w-full text-center">
      <Volume2 :size="80" class="mx-auto text-blue-500" />
      <p class="text-sm opacity-70 mt-2">サウンド</p>
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

    <!-- 評価ブロックなど、プレビューがない場合 -->
    <div v-else class="w-full text-center opacity-60">
      <div class="flex flex-col items-center space-y-2">
        <Settings :size="64" class="text-gray-400" />
        <p class="text-sm">このアクションにはプレビューがありません</p>
      </div>
    </div>

    <!-- テストボタン -->
    <div class="w-full text-center mt-2">
      <WordPartyTestButton
        v-if="action.actionType === 'wordParty'"
        :id="action.wordPartyId"
        :pattern="action.wordParty"
        :repeat="action.repeat"
      />
      <SoundTestButton
        v-if="soundEnabled && (action.actionType === 'sound' || action.actionType === 'message')"
        :sound="action.sound"
        :soundPath="action.soundPath"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { PostFlowType, CommentBubbleSchema, ToastWidgetsSchema } from '@/types'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SoundTestButton from './SoundTestButton.vue'
  import { processTestPlaceholder } from './TestPlaceholderProcessor'
  import WordPartyTestButton from './WordPartyTestButton.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import CommentBubbleItem from '@main/ui/CommentBubble/parts/CommentBubbleItem.vue'
  import ToastBubbleItem from '@main/ui/ToastWidgets/parts/ToastBubbleItem.vue'
  import LayerImage from '@/common/LayerImage/LayerImage.vue'
  import { Volume2, PartyPopper, MessagesSquare, Settings } from 'lucide-vue-next'

  const props = defineProps<{
    action: PostFlowType
  }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isCharacter } = useVisibilityAccess()
  const soundEnabled = computed(() => data.value.settings.soundEnabled)

  const enableSecondary = computed(() => data.value.components.enableSecondary)
  const characters = computed(() => data.value.characters)
  const bubbleSettings = computed(() => data.value.components.settings.bubble ?? CommentBubbleSchema.parse({}))
  const toastSettings = computed(() => data.value.components.settings.toast ?? ToastWidgetsSchema.parse({}))
  const commonStyle = computed(() => data.value.components.commonStyle)

  // キャラクター取得
  const character = computed(() => {
    if (!isCharacter.value || props.action.actionType !== 'message') return null
    const key = props.action.characterKey
    return key !== null ? characters.value[key] : null
  })

  // メッセージ処理
  const processedMessage = computed(() => {
    const _ = messageKey.value

    if (props.action.actionType !== 'message') return '(不正な処理です)'
    const content = props.action.message.bubble
    if (!content) return '(メッセージなし)'
    const processed = processTestPlaceholder(content, data.value.placeholders)
    if (!processed) return '(このメッセージは表示されません)'
    return transformIconPlaceholdersPreview(processed.text)
  })

  // リフレッシュキー
  const messageKey = ref(0)
  const refreshMessage = () => messageKey.value++

  function transformIconPlaceholdersPreview(raw: string): string {
    return raw.replace(/\{\{icon\s+([^\}]+)\}\}/g, (_, userId) => {
      // userId の頭文字を使った placeholder
      const initial = String(userId).charAt(0).toUpperCase()

      return `
      <span class="avatar placeholder mr-1 inline-flex">
        <span class="bg-neutral text-neutral-content w-6 h-6 rounded-full flex items-center justify-center text-sm">
          ${initial}
        </span>
      </span>
    `
    })
  }
</script>
