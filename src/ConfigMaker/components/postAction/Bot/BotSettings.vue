<!-- src/ConfigMaker/components/postAction/Bot/BotSettings.vue -->
<template>
  <!-- BOTの名前 -->
  <SettingItem label="🤖 BOTの名前" description="空白時はランダムになります">
    <input v-model="botName" type="text" class="input input-bordered input-sm w-full" />
  </SettingItem>

  <!-- コメント -->
  <SettingItem label="💬 メッセージ内容" description="プレースホルダーが使えます">
    <MessageTextDialog v-model="bubbleText" :isCommentMode="true" />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { PostFlowBotType } from '@/types'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import MessageTextDialog from '../Message/MessageTextDialog.vue'

  const props = defineProps<{
    action: PostFlowBotType
  }>()

  const emit = defineEmits<{
    'update:action': [action: PostFlowBotType]
  }>()

  const updateAction = (updates: Partial<PostFlowBotType>) => {
    emit('update:action', {
      ...props.action,
      ...updates,
    })
  }

  /** BOT名 */
  const botName = computed({
    get: () => props.action.botName,
    set: (val: string) => updateAction({ botName: val }),
  })

  /** コメント */
  const bubbleText = computed<string>({
    get: () => props.action.message.bubble ?? '',
    set: (value) =>
      updateAction({
        message: { ...props.action.message, bubble: value },
      }),
  })
</script>
