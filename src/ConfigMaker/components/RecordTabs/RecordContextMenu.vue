<!-- src\ConfigMaker\components\RecordTabs\RecordContextMenu.vue -->
<template>
  <!-- 右クリックコンテキストメニュー -->
  <div
    v-if="tabsStore.contextMenu.show"
    :style="{ top: tabsStore.contextMenu.y + 'px', left: tabsStore.contextMenu.x + 'px' }"
    class="fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-xl py-2 min-w-48"
    @click.stop
  >
    <!-- マルチセレクト時のヘッダー -->
    <div v-if="isMultiSelectActive" class="px-4 py-2 text-sm text-base-content/70 border-b border-base-300">
      {{ selectedCount }}件選択中
    </div>

    <!-- 有効/無効切り替え -->
    <div v-if="isMultiSelectActive">
      <!-- マルチセレクト時：有効/無効の一括切り替え -->
      <button
        @click="handleBulkToggleEnabled(true)"
        class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2"
      >
        <Eye class="w-4 h-4" />
        選択中のルールを有効にする
      </button>
      <button
        @click="handleBulkToggleEnabled(false)"
        class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2"
      >
        <EyeOff class="w-4 h-4" />
        選択中のルールを無効にする
      </button>
    </div>
    <div v-else>
      <!-- 単体選択時：個別の有効/無効切り替え -->
      <button @click="handleToggleEnabled" class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2">
        <component :is="tabsStore.contextMenu.rule?.isEnabled === false ? EyeOff : Eye" class="w-4 h-4" />
        {{ tabsStore.contextMenu.rule?.isEnabled === false ? '有効にする' : '無効にする' }}
      </button>
    </div>

    <div class="divider my-1"></div>

    <!-- AccessLevel 設定(GOD-MODE専用) -->
    <div v-if="isGod" class="px-4">
      <div class="text-sm text-base-content/70 mb-2">
        {{ isMultiSelectActive ? '選択中のルールの' : '' }}アクセスレベル
      </div>
      <div class="flex flex-col">
        <button
          v-for="level in AccessLevelLabels"
          :key="level"
          @click="handleAccessLevelChange(level)"
          class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2"
          :class="[
            !isMultiSelectActive && tabsStore.contextMenu.rule?.accessLevel === level
              ? level === 'basic'
                ? 'bg-primary text-primary-content'
                : level === 'pro'
                  ? 'bg-secondary text-secondary-content'
                  : level === 'internal'
                    ? 'bg-warning text-warning-content'
                    : 'bg-error text-error-content'
              : '',
          ]"
        >
          {{ isMultiSelectActive ? `選択中のルールを「${level}」にする` : level }}
        </button>
      </div>
      <div class="divider my-1"></div>
    </div>

    <!-- 複製 -->
    <button @click="handleDuplicate" class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2">
      <Copy class="w-4 h-4" />
      {{ isMultiSelectActive ? '選択中のルールを複製' : '複製' }}
    </button>

    <!-- 削除 -->
    <button
      @click="handleDelete"
      class="w-full px-4 py-2 text-left hover:bg-error hover:text-error-content flex items-center gap-2 text-error"
    >
      <Trash2 class="w-4 h-4" />
      {{ isMultiSelectActive ? '選択中のルールを削除' : '削除' }}
    </button>

    <div class="divider my-1"></div>

    <!-- カラー設定 -->
    <ColorPicker v-if="tabsStore.contextMenu.rule" v-model="tabsStore.contextMenu.rule.editorColor" />
  </div>

  <!-- コンテキストメニューを閉じるためのオーバーレイ -->
  <div v-if="tabsStore.contextMenu.show" @click="tabsStore.hideContextMenu" class="fixed inset-0 z-40"></div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useRecordTabsStore } from './RecordTabsStore'
  import ColorPicker from './ColorPicker.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { Eye, EyeOff, Copy, Trash2 } from 'lucide-vue-next'
  import { AccessLevelType, AccessLevelLabels } from '@shared/types'

  // Store
  const tabsStore = useRecordTabsStore()
  const { isGod } = useSettingMode()

  // マルチセレクト状態の計算プロパティ
  const isMultiSelectActive = computed(() => tabsStore.isMultiSelectMode && tabsStore.selectedRuleIds.size > 0)

  const selectedCount = computed(() => tabsStore.selectedRuleIds.size)

  // 有効/無効切り替え
  const handleToggleEnabled = () => {
    if (tabsStore.contextMenu.rule) {
      const currentEnabled = tabsStore.contextMenu.rule.isEnabled !== false
      tabsStore.handleUpdateRule(tabsStore.contextMenu.rule.id, {
        ...tabsStore.contextMenu.rule,
        isEnabled: !currentEnabled,
      })
    }
    tabsStore.hideContextMenu()
  }

  // 一括有効/無効切り替え
  const handleBulkToggleEnabled = (enabled: boolean) => {
    tabsStore.handleBulkToggleEnabled(enabled)
    tabsStore.hideContextMenu()
  }

  // AccessLevel変更
  const handleAccessLevelChange = (level: AccessLevelType) => {
    if (isMultiSelectActive.value) {
      // マルチセレクト時：一括変更
      tabsStore.handleBulkAccessLevelChange(level)
    } else if (tabsStore.contextMenu.rule) {
      // 単体選択時：個別変更
      tabsStore.handleUpdateRule(tabsStore.contextMenu.rule.id, {
        ...tabsStore.contextMenu.rule,
        accessLevel: level,
      })
    }
    tabsStore.hideContextMenu()
  }

  // 複製処理
  const handleDuplicate = () => {
    if (isMultiSelectActive.value) {
      // マルチセレクト時：一括複製
      tabsStore.handleBulkDuplicate()
    } else {
      // 単体選択時：個別複製
      tabsStore.handleContextDuplicate()
    }
    tabsStore.hideContextMenu()
  }

  // 削除処理
  const handleDelete = () => {
    if (isMultiSelectActive.value) {
      // マルチセレクト時：一括削除
      tabsStore.handleBulkDelete()
    } else {
      // 単体選択時：個別削除
      tabsStore.handleContextDelete()
    }
    tabsStore.hideContextMenu()
  }

  // ESCキーでメニューを閉じる
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      tabsStore.hideContextMenu()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
</script>
