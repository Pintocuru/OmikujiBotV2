<!-- src/ConfigMaker/dev/components/DevFileList.vue -->
<template>
  <div class="card bg-base-200 p-2 space-y-2">
    <template v-if="devStore.availableFiles.length > 0">
      <!-- フォルダなし（ルート直下） -->
      <div v-if="rootFiles.length > 0">
        <div class="grid grid-cols-2 md:grid-cols-3 gap-1">
          <DevFileItem v-for="file in rootFiles" :key="file.name" :file="file" :format-file-date="formatFileDate" />
        </div>
      </div>

      <!-- フォルダごとにグループ表示 -->
      <div v-for="(files, folder) in folderGroups" :key="folder">
        <!-- フォルダヘッダー（開閉可能） -->
        <button
          class="flex items-center gap-1 text-xs font-bold opacity-70 hover:opacity-100 w-full text-left mb-1"
          @click="toggleFolder(folder)"
        >
          <component :is="openFolders.has(folder) ? ChevronDown : ChevronRight" class="w-3 h-3" />
          <Folder class="w-3 h-3" />
          {{ folder }}
          <span class="opacity-50">（{{ files.length }}）</span>
        </button>

        <!-- フォルダの中身 -->
        <div v-if="openFolders.has(folder)" class="grid grid-cols-2 md:grid-cols-3 gap-1 pl-2">
          <DevFileItem v-for="file in files" :key="file.name" :file="file" :format-file-date="formatFileDate" />
        </div>
      </div>

      <!-- さらに表示ボタン（ルートファイルが多い場合） -->
      <div v-if="devStore.availableFiles.length > MAX_VISIBLE" class="text-center">
        <button class="btn btn-xs btn-outline" @click="toggleExpand">
          {{ showAll ? '隠す' : `さらに表示（${devStore.availableFiles.length - MAX_VISIBLE}件）` }}
        </button>
      </div>
    </template>

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
  import { ref, computed } from 'vue'
  import { useDevStore } from '@config/dev/stores/useDevStore'
  import DevFileItem from './DevFileItem.vue'
  import { formatFileDate } from '../services/apiServiceUtils'
  import { Folder, ChevronDown, ChevronRight } from 'lucide-vue-next'

  const devStore = useDevStore()
  const MAX_VISIBLE = 9
  const showAll = ref(false)

  // フォルダなしのファイル（ルート直下）
  const rootFiles = computed(() => devStore.availableFiles.filter((f) => f.folder === null))

  // フォルダごとにグループ化
  const folderGroups = computed(() => {
    const groups: Record<string, typeof devStore.availableFiles> = {}
    for (const file of devStore.availableFiles) {
      if (file.folder === null) continue
      if (!groups[file.folder]) groups[file.folder] = []
      groups[file.folder].push(file)
    }
    return groups
  })

  // フォルダの開閉状態
  const openFolders = ref<Set<string>>(new Set())
  const toggleFolder = (folder: string) => {
    if (openFolders.value.has(folder)) {
      openFolders.value.delete(folder)
    } else {
      openFolders.value.add(folder)
    }
  }

  const toggleExpand = () => {
    showAll.value = !showAll.value
  }
</script>
