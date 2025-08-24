<!-- src/configMaker/components/RecordTabs/RuleContextMenu.vue -->
<template>
  <!-- 右クリックコンテキストメニュー -->
  <div
    v-if="tabsStore.contextMenu.show"
    :style="{ top: tabsStore.contextMenu.y + 'px', left: tabsStore.contextMenu.x + 'px' }"
    class="fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-xl py-2 min-w-48"
    @click.stop
  >
    <!-- 有効/無効切り替え -->
    <button @click="handleToggleEnabled" class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2">
      <component :is="tabsStore.contextMenu.rule?.isEnabled === false ? EyeOff : Eye" class="w-4 h-4" />
      {{ tabsStore.contextMenu.rule?.isEnabled === false ? '有効にする' : '無効にする' }}
    </button>

    <div class="divider my-1"></div>

    <!-- AccessLevel 設定(GOD-MODE専用) -->
    <div v-if="isGod" class="px-4">
      <div class="text-sm text-base-content/70 mb-2">アクセスレベル</div>
      <div class="flex flex-col">
        <button
          v-for="level in AccessLevelLabels"
          :key="level"
          @click="handleAccessLevelChange(level)"
          class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2"
          :class="[
            tabsStore.contextMenu.rule?.accessLevel === level
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
          {{ level }}
        </button>
      </div>
      <div class="divider my-1"></div>
    </div>

    <!-- 複製 -->
    <button
      @click="tabsStore.handleContextDuplicate"
      class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2"
    >
      <Copy class="w-4 h-4" />
      複製
    </button>

    <!-- 削除 -->
    <button
      @click="tabsStore.handleContextDelete"
      class="w-full px-4 py-2 text-left hover:bg-error hover:text-error-content flex items-center gap-2 text-error"
    >
      <Trash2 class="w-4 h-4" />
      削除
    </button>

    <div class="divider my-1"></div>

    <!-- カラー設定 -->
    <ColorPicker v-if="tabsStore.contextMenu.rule" v-model="tabsStore.contextMenu.rule.editorColor" />
  </div>

  <!-- コンテキストメニューを閉じるためのオーバーレイ -->
  <div v-if="tabsStore.contextMenu.show" @click="tabsStore.hideContextMenu" class="fixed inset-0 z-40"></div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { useRecordTabsStore } from './RecordTabsStore'
  import ColorPicker from './ColorPicker.vue'
  import { Eye, EyeOff, Copy, Trash2 } from 'lucide-vue-next'
  import { AccessLevelType, AccessLevelLabels } from '@shared/types'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

  // Store
  const tabsStore = useRecordTabsStore()
  const { isGod } = useSettingMode()

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

  // AccessLevel変更
  const handleAccessLevelChange = (level: AccessLevelType) => {
    if (tabsStore.contextMenu.rule) {
      tabsStore.handleUpdateRule(tabsStore.contextMenu.rule.id, {
        ...tabsStore.contextMenu.rule,
        accessLevel: level,
      })
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
