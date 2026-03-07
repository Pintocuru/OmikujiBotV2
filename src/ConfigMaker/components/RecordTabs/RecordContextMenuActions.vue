<!-- src/ConfigMaker/components/RecordTabs/RecordContextMenuActions.vue -->
<template>
  <!-- アクションボタン群（横並び） -->
  <div class="flex px-2 gap-1">
    <!-- 有効/無効切り替え -->
    <div v-if="isMultiSelectActive" class="flex gap-1">
      <button
        @click="handleBulkToggleEnabled(true)"
        class="flex-1 px-3 py-2 hover:bg-base-200 rounded flex items-center justify-center gap-1 text-sm"
        title="有効にする"
      >
        <Eye class="w-4 h-4" />
        <span class="hidden sm:inline">有効</span>
      </button>
      <button
        @click="handleBulkToggleEnabled(false)"
        class="flex-1 px-3 py-2 hover:bg-base-200 rounded flex items-center justify-center gap-1 text-sm"
        title="無効にする"
      >
        <EyeOff class="w-4 h-4" />
        <span class="hidden sm:inline">無効</span>
      </button>
    </div>
    <div v-else>
      <button
        @click="handleToggleEnabled"
        class="flex-1 px-3 py-2 hover:bg-base-200 rounded flex items-center justify-center gap-1 text-sm"
        :title="rule?.isEnabled === false ? '有効にする' : '無効にする'"
      >
        <component :is="rule?.isEnabled === false ? EyeOff : Eye" class="w-4 h-4" />
        <span class="hidden sm:inline">
          {{ rule?.isEnabled === false ? '有効' : '無効' }}
        </span>
      </button>
    </div>

    <!-- 複製 -->
    <button
      @click="handleDuplicate"
      class="flex-1 px-3 py-2 hover:bg-base-200 rounded flex items-center justify-center gap-1 text-sm"
      title="複製"
    >
      <Copy class="w-4 h-4" />
      <span class="hidden sm:inline">複製</span>
    </button>

    <!-- 削除 -->
    <button
      @click="handleDelete"
      class="flex-1 px-3 py-2 hover:bg-error hover:text-error-content rounded flex items-center justify-center gap-1 text-sm text-error"
      title="削除"
    >
      <Trash2 class="w-4 h-4" />
      <span class="hidden sm:inline">削除</span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import { useRecordTabsStore } from './RecordTabsStore'
  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'
  import { Eye, EyeOff, Copy, Trash2 } from 'lucide-vue-next'

  // Props
  const props = defineProps<{
    rule?: any
    isMultiSelectActive: boolean
  }>()

  // Emits
  const emit = defineEmits<{
    close: []
  }>()

  // Store
  const tabsStore = useRecordTabsStore()

  // 有効/無効切り替え
  const handleToggleEnabled = () => {
    if (props.rule) {
      const currentEnabled = props.rule.isEnabled !== false
      tabsStore.handleUpdateRule(props.rule.key, {
        ...props.rule,
        isEnabled: !currentEnabled,
      })
    }
    emit('close')
  }

  // 一括有効/無効切り替え
  const handleBulkToggleEnabled = (enabled: boolean) => {
    const result = tabsStore.handleBulkToggleEnabled(enabled)
    if (!result) return

    const { count, action } = result
    swalToast.success({ title: `${count}件のイベントを${action}にしました` })
    emit('close')
  }

  // 複製処理
  const handleDuplicate = () => {
    if (props.isMultiSelectActive) {
      // マルチセレクト時：一括複製
      tabsStore.handleBulkDuplicate()
    } else {
      // 単体選択時：個別複製
      tabsStore.handleContextDuplicate()
    }
    emit('close')
  }

  // 削除処理
  const handleDelete = () => {
    if (props.isMultiSelectActive) {
      // マルチセレクト時：一括削除
      tabsStore.handleBulkDelete()
    } else {
      // 単体選択時：個別削除
      tabsStore.handleContextDelete()
    }
    emit('close')
  }
</script>
