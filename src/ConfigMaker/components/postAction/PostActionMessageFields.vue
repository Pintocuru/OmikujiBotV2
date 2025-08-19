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
    <WordPartyField :action="action" :index="index" />
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

  // コメント用のcomputedプロパティ
  const messageContent = computed({
    get: () => props.action.messageContent,
    set: (value) => {
      emit('update:action', { ...props.action, messageContent: value })
    },
  })

  // トースト用のcomputedプロパティ
  const messageToast = computed({
    get: () => props.action.messageToast,
    set: (value) => {
      emit('update:action', { ...props.action, messageToast: value })
    },
  })
</script>
