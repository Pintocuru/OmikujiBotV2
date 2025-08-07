<!-- src/MainGenerator/userVisits/ViewUserHeader.vue -->
<template>
 <div class="bg-white rounded-lg shadow-md px-4 py-1 mb-2 flex-shrink-0">
  <div class="flex justify-between items-start mb-2">
   <div>
    <h1 class="text-xl font-bold text-gray-800">ユーザーリスト</h1>
    <div class="flex gap-3 text-sm text-gray-600 mt-0">
     <span>
      総ユーザー数: <span class="font-semibold text-blue-600">{{ totalUsers }}</span>
     </span>
     <span>
      初見さん: <span class="font-semibold text-green-600">{{ syokenUsers }}</span>
     </span>
    </div>
   </div>

   <!-- Compact Controls -->
   <div class="flex items-center gap-2">
    <!-- Add User Button -->
    <button
     @click="addTestUser"
     class="px-3 py-1 text-xs rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
     title="テストユーザーを追加"
    >
     ユーザー追加
    </button>

    <!-- Team Display Toggle -->
    <button
     @click="$emit('update:show-team-display', !showTeamDisplay)"
     :class="[
      'px-3 py-1 text-xs rounded-full transition-colors',
      showTeamDisplay ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
     ]"
    >
     {{ showTeamDisplay ? 'リスト' : 'チーム' }}
    </button>

    <!-- Settings Button -->
    <button
     @click="$emit('update:show-display-settings', !showDisplaySettings)"
     :class="[
      'w-8 h-8 rounded-full flex items-center justify-center transition-colors',
      showDisplaySettings ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
     ]"
    >
     <Settings class="w-4 h-4" />
    </button>
   </div>
  </div>

  <!-- Display Settings Panel -->
  <div v-show="showDisplaySettings" class="border-t pt-3 space-y-3">
   <!-- Filter Settings -->
   <div>
    <h3 class="text-sm font-medium text-gray-700 mb-2">フィルター</h3>
    <div class="flex flex-wrap gap-2">
     <button
      @click="$emit('toggle-filter', 'hideSystemUsers')"
      :class="[
       'flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors',
       filterSettings.hideSystemUsers
        ? 'bg-red-100 text-red-700 border border-red-300'
        : 'bg-gray-100 text-gray-600 border border-gray-300'
      ]"
     >
      <Eye v-if="filterSettings.hideSystemUsers" class="w-3 h-3" />
      <EyeOff v-else class="w-3 h-3" />
      システムユーザーを隠す
     </button>
    </div>
   </div>

   <!-- Optional Field Settings -->
   <div>
    <h3 class="text-sm font-medium text-gray-700 mb-2">詳細情報</h3>
    <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
     <button
      v-for="(label, key) in displayLabels"
      :key="key"
      @click="$emit('toggle-display', key)"
      :class="[
       'flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors',
       displaySettings[key]
        ? 'bg-blue-100 text-blue-700 border border-blue-300'
        : 'bg-gray-100 text-gray-600 border border-gray-300'
      ]"
     >
      <Eye v-if="displaySettings[key]" class="w-3 h-3" />
      <EyeOff v-else class="w-3 h-3" />
      {{ label }}
     </button>
    </div>
   </div>

   <!-- Sort Options -->
   <div>
    <h3 class="text-sm font-medium text-gray-700 mb-2">ソート</h3>
    <div class="flex flex-wrap gap-2">
     <button
      v-for="option in sortOptions"
      :key="option.key"
      @click="$emit('set-sort-option', option.key)"
      :class="[
       'px-2 py-1 text-xs rounded transition-colors',
       sortBy === option.key
        ? 'bg-green-100 text-green-700 border border-green-300'
        : 'bg-gray-100 text-gray-600 border border-gray-300'
      ]"
     >
      {{ option.label }}
     </button>
    </div>
   </div>

   <!-- Custom Properties Settings -->
   <div>
    <h3 class="text-sm font-medium text-gray-700 mb-2">カスタムプロパティ</h3>
    <div class="flex flex-wrap gap-2">
     <button
      v-for="(label, key) in customPropertyLabels"
      :key="key"
      @click="$emit('toggle-custom-property', key)"
      :class="[
       'flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors',
       customPropertySettings[key]
        ? 'bg-purple-100 text-purple-700 border border-purple-300'
        : 'bg-gray-100 text-gray-600 border border-gray-300'
      ]"
     >
      <Eye v-if="customPropertySettings[key]" class="w-3 h-3" />
      <EyeOff v-else class="w-3 h-3" />
      {{ label }}
     </button>
    </div>
   </div>
  </div>
 </div>
</template>

<script setup lang="ts">
import { Settings, Eye, EyeOff } from 'lucide-vue-next';
import {
 displayLabels,
 customPropertyLabels,
 CustomPropertyKey,
 sortOptions,
 testUser
} from './constants';
import { UserVisitType } from '@shared/types/';

// Props - 親から状態を受け取る
const props = defineProps<{
 showDisplaySettings: boolean;
 showTeamDisplay: boolean;
 displaySettings: Record<string, boolean>;
 filterSettings: Record<string, boolean | string | number>;
 customPropertySettings: Record<CustomPropertyKey, boolean>;
 sortBy: string;
 totalUsers: number;
 syokenUsers: number;
}>();

// Emits - 親に変更を通知
const emit = defineEmits<{
 'update:show-display-settings': [value: boolean];
 'update:show-team-display': [value: boolean];
 'toggle-display': [field: string];
 'toggle-filter': [field: string];
 'toggle-custom-property': [key: CustomPropertyKey];
 'set-sort-option': [option: string];
 'add-user': [user: UserVisitType];
}>();

// テストユーザーを追加する関数
const addTestUser = () => {
 emit('add-user', testUser);
};
</script>
