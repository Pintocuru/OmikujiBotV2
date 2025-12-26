<!-- src\ConfigMaker\components\postAction\preview\PostActionPreview.vue -->
<template>
  <div class="h-full flex flex-col items-center justify-center space-y-4">
    <!-- メッセージアクション -->
    <div v-if="action.actionType === 'message'" class="w-full">
      <!-- フキダシ -->
      <div v-if="!isToast" class="space-y-8 flex flex-col items-center">
        <CommentBubbleItem
          :key="messageKey"
          :botName="character ? character.displayName : undefined"
          :message="processedMessage"
          :color="character ? character.color : toastSettings.defaultColor"
          @click="refreshMessage"
          class="cursor-pointer"
        />
        <CharacterAvatar
          v-if="isCharacter"
          :profileImage="character ? character.image[action.iconKey] : []"
          :characterSize="bubbleSettings.characterSize"
          :showCharacterFrame="false"
        />
      </div>
      <!-- トースト -->

      <div v-else @click="refreshToast" class="cursor-pointer">
        <ChatBubbleItem
          :key="toastKey"
          :simpleMessage="processedToastMessage"
          :showToastsOnRight="toastSettings.showToastsOnRight"
          :character="character"
          :iconKey="action.iconKey"
          :isCharacterDisplay="toastSettings.showToastsCharacter"
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
    <div class="w-full text-center mt-2">
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
  import { PostActionType } from '@/types/'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { PartyPopper, MessagesSquare } from 'lucide-vue-next'

  import CommentBubbleItem from '@/MainGenerator/components/CommentBubble/CommentBubbleItem.vue'
  import ChatBubbleItem from '@/MainGenerator/components/ToastWidgets/ToastBubbleItem.vue'
  import CharacterAvatar from '@/MainGenerator/components/CommentBubble/CharacterAvatar.vue'
  import WordPartyTestButton from '@/ConfigMaker/components/wordPartySettings/WordPartyTestButton.vue'
  import SoundTestButton from '@/ConfigMaker/components/wordPartySettings/SoundTestButton.vue'
  import { processTestPlaceholder } from './TestPlaceholderProcessor'
  import { hasAccess } from '@/ConfigMaker/scripts/useSettingMode'

  const props = defineProps<{ action: PostActionType }>()

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const characters = computed(() => data.value.characters)
  const bubbleSettings = computed(() => data.value.components.bubble)
  const toastSettings = computed(() => data.value.components.toast)

  const isCharacter = computed(() => hasAccess(data.value.featureUsage.usage.characters))

  // プレースホルダー処理
  const processMessage = (message: string) => {
    return processTestPlaceholder(message, data.value.placeholders)
  }

  // キャラクター取得
  const character = computed(() => {
    if (!isCharacter.value || props.action.actionType !== 'message') return null
    return characters.value[props.action.characterKey]
  })

  // トースト表示判定
  const isToast = computed(() => props.action.actionType === 'message' && props.action.message.toast)

  // メッセージ処理
  const processedMessage = computed(() => {
    // ここで messageKey.value を参照することで、
    // messageKey が更新されたとき、この computed も再計算されるようになります
    const _ = messageKey.value

    if (props.action.actionType !== 'message') return ''
    const content = props.action.message.bubble || '(未記入)'
    return processMessage(content)
  })

  const processedToastMessage = computed(() => {
    // toastKey も同様です
    const _ = toastKey.value

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
