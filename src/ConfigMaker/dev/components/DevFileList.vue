<!-- src/configMaker/dev/components/DevFileList.vue -->
<template>
  <div class="card bg-base-200 p-2">
    <div v-if="devStore.availableFiles.length > 0">
      <div class="grid grid-cols-2 md:grid-cols-3 gap-1">
        <DevFileItem v-for="file in displayedFiles" :key="file.name" :file="file" :format-file-date="formatFileDate" />
      </div>

      <!-- 13件以上ある場合、残りを展開できる -->
      <div v-if="devStore.availableFiles.length > MAX_VISIBLE" class="text-center">
        <button class="btn btn-xs btn-outline" @click="toggleExpand">
          {{ showAll ? '隠す' : `さらに表示（${devStore.availableFiles.length - MAX_VISIBLE}件）` }}
        </button>
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
  import { ref, computed } from 'vue'
  import { useDevStore } from '@config/dev/stores/useDevStore'
  import DevFileItem from './DevFileItem.vue'
  import { formatFileDate } from '../services/devConfigUtils'

  const devStore = useDevStore()
  const MAX_VISIBLE = 9
  const showAll = ref(false)

  const displayedFiles = computed(() =>
    showAll.value ? devStore.availableFiles : devStore.availableFiles.slice(0, MAX_VISIBLE)
  )

  const toggleExpand = () => {
    showAll.value = !showAll.value
  }
</script>
