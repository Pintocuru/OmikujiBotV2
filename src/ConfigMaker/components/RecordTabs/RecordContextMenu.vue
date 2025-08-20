<!-- src/configMaker/components/RecordTabs/RuleContextMenu.vue -->
<template>
  <!-- 右クリックコンテキストメニュー -->
  <div
    v-if="store.contextMenu.show"
    :style="{ top: store.contextMenu.y + 'px', left: store.contextMenu.x + 'px' }"
    class="fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-xl py-2 min-w-48"
    @click.stop
  >
    <!-- 有効/無効切り替え -->
    <button @click="handleToggleEnabled" class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2">
      <component :is="store.contextMenu.rule?.isEnabled === false ? EyeOff : Eye" class="w-4 h-4" />
      {{ store.contextMenu.rule?.isEnabled === false ? '有効にする' : '無効にする' }}
    </button>

    <div class="divider my-1"></div>

    <!-- AccessLevel 設定(GOD-MODE専用) -->
    <div v-if="data.displaySettings.developer.godModeEnabled" class="px-4">
      <div class="text-sm text-base-content/70 mb-2">アクセスレベル</div>
      <div class="flex flex-col">
        <button
          v-for="level in AccessLevelLabels"
          :key="level"
          @click="handleAccessLevelChange(level)"
          class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2"
          :class="[
            store.contextMenu.rule?.accessLevel === level
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
      @click="store.handleContextDuplicate"
      class="w-full px-4 py-2 text-left hover:bg-base-200 flex items-center gap-2"
    >
      <Copy class="w-4 h-4" />
      複製
    </button>

    <!-- 削除 -->
    <button
      @click="store.handleContextDelete"
      class="w-full px-4 py-2 text-left hover:bg-error hover:text-error-content flex items-center gap-2 text-error"
    >
      <Trash2 class="w-4 h-4" />
      削除
    </button>

    <div class="divider my-1"></div>

    <!-- カラー設定 -->
    <div class="px-4 py-2">
      <div class="text-sm text-base-content/70 mb-2">カラー設定</div>
      <ColorPicker
        v-if="store.contextMenu.rule"
        v-model="store.contextMenu.rule.editorColor"
        @update:model-value="handleColorChange"
      />
    </div>
  </div>

  <!-- コンテキストメニューを閉じるためのオーバーレイ -->
  <div v-if="store.contextMenu.show" @click="store.hideContextMenu" class="fixed inset-0 z-40"></div>
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'
  import { useRecordTabsStore } from './RecordTabsStore'
  import ColorPicker from './ColorPicker.vue'
  import { Eye, EyeOff, Copy, Trash2 } from 'lucide-vue-next'
  import { AccessLevelType, AccessLevelLabels } from '@shared/types'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  // Store
  const store = useRecordTabsStore()
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 有効/無効切り替え
  const handleToggleEnabled = () => {
    if (store.contextMenu.rule) {
      const currentEnabled = store.contextMenu.rule.isEnabled !== false
      store.handleUpdateRule(store.contextMenu.rule.id, {
        ...store.contextMenu.rule,
        isEnabled: !currentEnabled,
      })
    }
    store.hideContextMenu()
  }

  // カラー変更
  const handleColorChange = (color: string) => {
    if (store.contextMenu.rule) {
      store.handleUpdateRule(store.contextMenu.rule.id, {
        ...store.contextMenu.rule,
        editorColor: color,
      })
    }
  }

  // AccessLevel変更
  const handleAccessLevelChange = (level: AccessLevelType) => {
    if (store.contextMenu.rule) {
      store.handleUpdateRule(store.contextMenu.rule.id, {
        ...store.contextMenu.rule,
        accessLevel: level,
      })
    }
    store.hideContextMenu()
  }

  // ESCキーでメニューを閉じる
  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      store.hideContextMenu()
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleKeydown)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
</script>
