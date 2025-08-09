<!-- src/configMaker/components/placeholders/PlaceholderList.vue -->
<template>
 <div class="card bg-base-300">
  <h3 class="card-title bg-primary text-lg p-2 pl-4 rounded-t text-white">プレースホルダー一覧</h3>

  <div class="card-body p-2">
   <!-- 検索バー -->
   <div class="form-control">
    <input
     type="text"
     v-model="searchQuery"
     :placeholder="`プレースホルダーを検索... (${filteredPlaceholders.length}/${allPlaceholders.length}件)`"
     class="input input-bordered input-sm w-full"
    />
   </div>

   <!-- プレースホルダーリスト -->
   <div class="space-y-1 max-h-48 overflow-y-auto">
    <PlaceholderItem
     v-for="placeholder in filteredPlaceholders"
     :key="placeholder.id"
     :placeholder="placeholder"
     :is-used="usedPlaceholderIds.has(placeholder.id)"
     :is-default="defaultPlaceholders.includes(placeholder.id)"
     :random-value="getRandomValue(placeholder)"
    />
   </div>

   <!-- プレースホルダーが見つからない場合 -->
   <div v-if="filteredPlaceholders.length === 0" class="text-center py-8 text-base-content/60">
    <div class="text-4xl mb-2">📋</div>
    <div v-if="searchQuery" class="text-sm">
     「{{ searchQuery }}」に一致するプレースホルダーが見つかりません
    </div>
    <div v-else class="text-sm">プレースホルダーがありません</div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { PostActionType } from '@/types/';
import { usePlaceholders } from './composables/usePlaceholders';
import PlaceholderItem from './PlaceholderItem.vue';

// Props
const props = defineProps<{
 actions: PostActionType[];
}>();

// Composable
const {
 searchQuery,
 allPlaceholders,
 filteredPlaceholders,
 usedPlaceholderIds,
 getRandomValue,
 defaultPlaceholders
} = usePlaceholders(props.actions);
</script>
