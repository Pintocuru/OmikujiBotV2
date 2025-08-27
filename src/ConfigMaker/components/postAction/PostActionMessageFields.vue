<!-- src/configMaker/components/postAction/PostActionMessageFields.vue -->
<template>
  <div class="space-y-2 mb-2">
    <!-- コメント -->
    <div class="flex items-center gap-2">
      <label class="w-24 text-xs flex-shrink-0">💬 コメント</label>
      <input
        type="text"
        v-model="messageContent"
        class="input input-bordered input-sm w-2/3"
        placeholder="コメントの投稿"
      />
    </div>

    <!-- トースト -->
    <div class="flex items-center gap-2">
      <label class="w-24 text-xs flex-shrink-0">🍞 トースト</label>
      <input
        type="text"
        v-model="messageToast"
        class="input input-bordered input-sm w-2/3"
        placeholder="トーストの表示"
      />
    </div>

    <!-- WordParty -->
    <WordPartyField v-model:wordParty="wordPartyValue" :action="action" :index="index" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import WordPartyField from './WordPartyField.vue'

  const props = defineProps<{
    action: PostActionType
    index: number
  }>()

  const emit = defineEmits(['update:action'])

  // 共通のupdateAction関数
  const updateAction = (updates: Partial<PostActionType>) => {
    emit('update:action', { ...props.action, ...updates })
  }

  // コメント用のcomputedプロパティ
  const messageContent = computed({
    get: () => props.action.messageContent,
    set: (value) => updateAction({ messageContent: value }),
  })

  // トースト用のcomputedプロパティ
  const messageToast = computed({
    get: () => props.action.messageToast,
    set: (value) => updateAction({ messageToast: value }),
  })

  // WordParty用のcomputedプロパティ
  const wordPartyValue = computed({
    get: () => props.action.wordParty,
    set: (value) => updateAction({ wordParty: value }),
  })
</script>
