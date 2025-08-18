<!-- src/configMaker/components/postAction/PostActionMessageFields.vue -->
<template>
  <div class="space-y-2 mb-2">
    <div class="flex items-center gap-2">
      <label class="w-24 text-xs flex-shrink-0">💬 コメント</label>
      <input
        type="text"
        v-model="messageModel"
        class="input input-bordered input-sm w-2/3"
        placeholder="コメントの投稿"
      />
    </div>

    <div class="flex items-center gap-2">
      <label class="w-24 text-xs flex-shrink-0">🍞 トースト</label>
      <input
        type="text"
        v-model="messageModel"
        class="input input-bordered input-sm w-2/3"
        placeholder="トーストの表示"
      />
    </div>

    <WordPartyField :action="action" :index="index" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PostActionType } from '@/types/'
  import WordPartyField from './WordPartyField.vue'

  const props = defineProps<{
    action: PostActionType
    index: number
  }>()

  const emit = defineEmits(['update:action'])

  // コメント用のcomputedプロパティ
  const messageModel = computed({
    get: () => props.action.messageContent,
    set: (value) => {
      // 親コンポーネントに新しい値を渡して、更新を依頼する
      emit('update:action', { ...props.action, messageContent: value })
    },
  })
</script>
