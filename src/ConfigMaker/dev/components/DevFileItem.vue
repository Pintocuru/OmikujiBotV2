<!-- src/ConfigMaker/dev/components/DevFileItem.vue -->
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
        @click="devStore.applyConfigFile(file.name)"
        :disabled="devStore.isLoading || devStore.isAnyLoading"
        class="btn btn-xs btn-primary tooltip tooltip-bottom"
        data-tip="この設定を読み込む"
      >
        <Download class="w-3 h-3" />
      </button>

      <!-- 部分読み込み -->
      <button
        @click="handlePartialLoad"
        :disabled="devStore.isLoading || devStore.isAnyLoading || importManager.isLoading.value"
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
      <FileMenuDropdown
        :folders="availableFolders"
        :current-folder="file.folder"
        :show-move="isGod || isDev"
        :disable-delete="devStore.isDeletingFile(file.name) || devStore.isAnyLoading"
        @move="(folder) => devStore.moveFile(file.name, folder)"
        @duplicate="devStore.duplicateFile(file.name)"
        @delete="devStore.deleteFile(file.name)"
      />
    </div>
  </div>

  <!-- インポートプレビューモーダル -->
  <ConfigImportModal v-if="importManager.showPreviewModal.value" :import-manager="importManager" />
</template>

<script setup lang="ts">
  import { ref, nextTick, computed } from 'vue'
  import type { FileItem } from '../devTypes'
  import { useDevStore } from '@config/dev/stores/useDevStore'
  import { useImportManager } from '@config/components/presetsImport/composables/useImportManager'
  import ConfigImportModal from '@config/components/presetsImport/ConfigImportModal.vue'
  import FileMenuDropdown from './FileMenuDropdown.vue'
  import { Download, FileText, Edit } from 'lucide-vue-next'
  import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { useSettingMode } from '@/ConfigMaker/scripts/useAccessCheckerConfig'
  import { isDev } from '@/types'

  const props = defineProps<{
    file: FileItem
    formatFileDate: (date: string) => string
  }>()

  // stores
  const devStore = useDevStore()

  // インポートマネージャー
  const importManager = useImportManager()
  const { isGod } = useSettingMode()

  // 名前編集関連
  const isEditing = ref(false)
  const editingName = ref('')
  const editInputRef = ref<HTMLInputElement>()

  const availableFolders = computed(() => [
    ...new Set(devStore.availableFiles.map((f) => f.folder).filter((f): f is string => f !== null)),
  ])

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
      devStore.moveFile(props.file.name, newName)
    }
    cancelRename()
  }

  // 名前変更キャンセル
  const cancelRename = () => {
    isEditing.value = false
    editingName.value = ''
  }

  // 部分読み込み開始
  const handlePartialLoad = async () => {
    try {
      // devStoreからファイルデータを取得
      const fileData = await devStore.fetchFileData(props.file.name)

      // useImportManagerで直接JSONデータを読み込み
      const result = await importManager.loadFromJsonData(fileData)

      if (!result.success) {
        if (result.error === 'invalid-metadata') {
          await swalModal.error({
            title: '無効なファイル',
            text: 'このファイルはおみくじBOTのデータではありません。',
          })
        } else {
          await swalModal.error({
            title: '読み込みエラー',
            text: result.error || '不明なエラーが発生しました',
          })
        }
        return
      }

      // プレビュー生成とモーダル表示
      importManager.generatePreview()
      importManager.openPreviewModal()
    } catch (error) {
      console.error('Partial load error:', error)

      await swalModal.error({
        title: 'ファイルの読み込みに失敗しました',
        text: 'コンソールログをご確認ください',
      })
    }
  }
</script>
