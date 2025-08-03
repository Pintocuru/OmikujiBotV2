<!-- src/configMaker/dev/components/DevFileList.vue -->
<template>
 <div class="card bg-base-200 p-4">
  <h3 class="font-medium mb-3 flex items-center gap-2">
   <FolderOpen class="w-4 h-4" />
   設定読み込み
   <button
    @click="devStore.fetchFileList"
    :disabled="devStore.isLoadingFileList"
    class="btn btn-info btn-xs tooltip tooltip-bottom"
    data-tip="ファイル一覧を再読み込み"
   >
    <span v-if="devStore.isLoadingFileList" class="loading loading-spinner loading-xs"></span>
    <RefreshCw class="w-4 h-4" />
   </button>
  </h3>

  <div v-if="devStore.availableFiles.length > 0" class="space-y-1">
   <div class="text-xs">保存済みファイル:</div>
   <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <DevFileItem
     v-for="file in devStore.availableFiles"
     :key="file.name"
     :file="file"
     :format-file-date="formatFileDate"
    />
   </div>
  </div>

  <div v-else-if="!devStore.isLoadingFileList" class="text-xs opacity-70 text-center py-4">
   保存済みファイルはありません
  </div>

  <div v-else class="text-xs opacity-70 text-center py-4">
   <span class="loading loading-spinner loading-xs mr-2"></span>
   ファイル一覧を読み込み中...
  </div>
 </div>
</template>

<script setup lang="ts">
import { useDevStore } from '@/ConfigMaker/dev/stores/useDevStore';
import DevFileItem from './DevFileItem.vue';
import { formatFileDate } from '../services/devConfigUtils';
import { FolderOpen, RefreshCw } from 'lucide-vue-next';

const devStore = useDevStore();
</script>
