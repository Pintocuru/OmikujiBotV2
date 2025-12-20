<!-- src/configMaker/dev/components/DevFileItem.vue -->
<template>
  <div class="flex items-center justify-between bg-base-300 rounded p-2 text-sm">
    <div class="flex-1 min-w-0">
      <div v-if="isEditing" class="space-y-1">
        <input
          ref="editInputRef"
          v-model="editingName"
          @keypress.enter="confirmRename"
          @keydown.escape="cancelRename"
          @blur="cancelRename"
          class="input input-xs w-full"
          placeholder="新しいファイル名"
        />
        <div class="text-xs">{{ formatFileDate(file.modified) }}</div>
      </div>

      <div v-else>
        <div class="font-medium">{{ file.displayName }}</div>
        <div class="text-xs">{{ formatFileDate(file.modified) }}</div>
      </div>
    </div>

    <!-- ボタン群 -->
    <div class="flex gap-1 ml-2 flex-shrink-0">
      <!-- 置き換え -->
      <button
        @click="devStore.loadConfig(file.name)"
        :disabled="devStore.isLoading || devStore.isAnyLoading"
        class="btn btn-xs btn-primary tooltip tooltip-bottom"
        data-tip="この設定を読み込む"
      >
        <Download class="w-3 h-3" />
      </button>

      <!-- 部分読み込み -->
      <button
        @click="handlePartialLoad"
        :disabled="devStore.isLoading || devStore.isAnyLoading || importStore.isLoading"
        class="btn btn-xs btn-secondary tooltip tooltip-bottom"
        data-tip="この設定を部分的に読み込み/マージ"
      >
        <FileText class="w-3 h-3" />
      </button>

      <!-- ファイル名変更 -->
      <button
        @click="startRename"
        class="btn btn-xs btn-info tooltip tooltip-bottom"
        data-tip="名前変更"
        :disabled="devStore.isAnyLoading"
      >
        <Edit class="w-3 h-3" />
      </button>

      <!-- 複製・削除 -->
      <MenuDropdown
        @duplicate="devStore.duplicateFile(file.name)"
        @delete="devStore.deleteFile(file.name)"
        :disable-delete="devStore.isDeletingFile(file.name) || devStore.isAnyLoading"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, nextTick } from 'vue'
  import type { FileItem } from '../devTypes'
  import { useDevStore } from '@/ConfigMaker/dev/stores/useDevStore'
  import { useImportStore } from '@/ConfigMaker/components/presetsImport/useImportStore'
  import MenuDropdown from '@shared/components/parts/MenuDropdown.vue'
  import Swal from 'sweetalert2'
  import { Download, FileText, Edit } from 'lucide-vue-next'

  const props = defineProps<{
    file: FileItem
    formatFileDate: (date: string) => string
  }>()

  // stores
  const devStore = useDevStore()
  const importStore = useImportStore()

  // 名前編集関連
  const isEditing = ref(false)
  const editingName = ref('')
  const editInputRef = ref<HTMLInputElement>()

  // 名前変更開始
  const startRename = () => {
    isEditing.value = true
    editingName.value = props.file.displayName
    nextTick(() => {
      editInputRef.value?.focus()
      editInputRef.value?.select()
    })
  }

  // 名前変更確定
  const confirmRename = () => {
    const newName = editingName.value.trim()
    if (newName && newName !== props.file.displayName) {
      devStore.renameFile(props.file.name, newName)
    }
    cancelRename()
  }

  // 名前変更キャンセル
  const cancelRename = () => {
    isEditing.value = false
    editingName.value = ''
  }

  // 部分読み込み開始（loadFromJsonDataを使用）
  const handlePartialLoad = async () => {
    try {
      // devStoreからファイルデータを取得
      const fileData = await devStore.fetchFileData(props.file.name)

      // useImportStoreで直接JSONデータを読み込み
      const success = await importStore.loadFromJsonData(fileData)

      if (importStore.loadError) {
        Swal.fire({
          icon: 'error',
          title: '読み込みエラー',
          text: importStore.loadError,
        })
        return
      }

      if (success) {
        // デフォルトを部分読み込みに設定
        importStore.setGlobalImportMode('partial')
        importStore.generatePreview()
        importStore.openPreviewModal()
      }
    } catch (error) {
      console.error('Partial load error:', error)

      Swal.fire({
        icon: 'error',
        title: 'ファイルの読み込みに失敗しました',
        text: 'ファイル形式や内容をご確認ください。',
      })
    }
  }
</script>
