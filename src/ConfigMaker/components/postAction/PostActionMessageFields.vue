<!-- src/configMaker/components/postAction/PostActionMessageFields.vue -->
<template>
 <div class="space-y-2 mb-2">
  <!-- コメント -->
  <div class="flex items-center gap-2">
   <label class="w-24 text-xs flex-shrink-0">💬 コメント</label>
   <input
    type="text"
    v-model="action.messageContent"
    class="input input-bordered input-sm w-2/3"
    placeholder="コメントの投稿"
   />
  </div>

  <!-- トースト -->
  <div class="flex items-center gap-2">
   <label class="w-24 text-xs flex-shrink-0">🍞 トースト</label>
   <input
    type="text"
    v-model="action.messageToast"
    class="input input-bordered input-sm w-2/3"
    placeholder="トーストの表示"
   />
  </div>

  <!-- WordParty -->
  <WordPartyField :action="action" :index="index" />
 </div>
</template>

<script setup lang="ts">
import { PostActionType } from '@/types/';
import WordPartyField from './WordPartyField.vue';

// Props
defineProps<{
 action: PostActionType;
 index: number;
}>();
</script>
