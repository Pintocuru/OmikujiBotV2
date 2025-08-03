<!-- src/configMaker/components/postAction/PostActionBasicSettings.vue -->
<template>
 <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2 max-w-screen-md">
  <!-- キャラクター -->
  <div v-if="action.messageContent !== '' || action.messageToast !== ''" class="form-control">
   <label class="label py-0">
    <span class="label-text text-xs">👤 キャラクター</span>
   </label>
   <select v-model="action.characterKey" class="select select-bordered select-sm w-full">
    <option v-for="char in characterOptions" :key="char.value" :value="char.value">
     {{ char.label }}
    </option>
   </select>
  </div>

  <!-- アイコン -->
  <IconSelector
   v-if="action.messageContent !== '' || action.messageToast !== ''"
   :character-key="action.characterKey"
   :icon-key="action.iconKey"
   @update:icon-key="action.iconKey = $event as CharacterEmotionType"
  />

  <!-- 遅延秒数 -->
  <div class="form-control">
   <label class="label py-0">
    <span class="label-text text-xs">⏱️ 遅延秒数</span>
   </label>
   <input
    type="number"
    v-model.number="action.delaySeconds"
    min="-1"
    step="0.1"
    class="input input-bordered input-sm w-full"
    placeholder="0"
   />
  </div>
 </div>
</template>

<script setup lang="ts">
import { CharacterEmotionType, PostActionType } from '@type/';
import IconSelector from '@ConfigComponents/comments/IconSelector.vue';

// Props
defineProps<{
 action: PostActionType;
 characterOptions: Array<{ value: string; label: string }>;
}>();
</script>
