<!-- src/ConfigMaker/components/RecordTabs/RecordContextMenu.vue -->
<template>
  <!-- 右クリックコンテキストメニュー -->
  <div
    v-if="tabsStore.contextMenu.show"
    :style="menuPosition"
    class="fixed z-50 bg-base-100 border border-base-300 rounded-lg shadow-xl py-2 min-w-48"
    @click.stop
    ref="menuRef"
  >
    <!-- AccessLevel 設定(GOD-MODE専用) -->
    <div v-if="isGod" class="px-4">
      <div class="flex">
        <button
          v-for="level in AccessLevelLabels"
          :key="level"
          @click="handleAccessLevelChange(level)"
          class="btn btn-ghost btn-xs px-2 py-2 mr-1 hover:bg-secondary"
        >
          {{ level }}
        </button>
      </div>
      <div class="divider my-1"></div>
    </div>

    <!-- アクションボタン群（子コンポーネントに分離） -->
    <RecordContextMenuActions
      :rule="tabsStore.contextMenu.rule"
      :is-multi-select-active="isMultiSelectActive"
      @close="tabsStore.hideContextMenu"
    />

    <div class="divider my-1"></div>

    <!-- カラー設定 -->
    <ColorPicker v-if="tabsStore.contextMenu.rule" v-model="tabsStore.contextMenu.rule.editorColor" />
  </div>

  <!-- コンテキストメニューを閉じるためのオーバーレイ -->
  <div v-if="tabsStore.contextMenu.show" @click="tabsStore.hideContextMenu" class="fixed inset-0 z-40"></div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import { useRecordTabsStore } from './RecordTabsStore'
  import ColorPicker from './ColorPicker.vue'
  import RecordContextMenuActions from './RecordContextMenuActions.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { AccessLevelType, AccessLevelLabels } from '@shared/types'
  import { swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

  // Store
  const tabsStore = useRecordTabsStore()
  const { isGod } = useSettingMode()

  // Refs
  const menuRef = ref<HTMLElement>()

  // マルチセレクト状態の計算プロパティ
  const isMultiSelectActive = computed(() => tabsStore.isMultiSelectMode && tabsStore.selectedRuleIds.size > 0)

  // メニュー位置の計算（画面端での調整）
  const menuPosition = computed(() => {
    const { x, y } = tabsStore.contextMenu
    const menuWidth = 200 // 推定メニュー幅
    const menuHeight = 300 // 推定メニュー高さ

    let adjustedX = x
    let adjustedY = y

    // 画面右端を超える場合は左側に表示
    if (x + menuWidth > window.innerWidth) {
      adjustedX = x - menuWidth
    }

    // 画面下端を超える場合は上側に表示
    if (y + menuHeight > window.innerHeight) {
      adjustedY = y - menuHeight
    }

    // 最小値制限（画面外に出ないように）
    adjustedX = Math.max(0, adjustedX)
    adjustedY = Math.max(0, adjustedY)

    return {
      top: `${adjustedY}px`,
      left: `${adjustedX}px`,
    }
  })

  // AccessLevel変更
  const handleAccessLevelChange = (level: AccessLevelType) => {
    if (isMultiSelectActive.value) {
      // 一括変更
      const result = tabsStore.handleBulkAccessLevelChange(level)

      if (result) {
        const { count, accessLevel } = result
        swalToast.success({
          title: `${count}件のイベントのアクセスレベルを「${accessLevel}」に変更しました`,
        })
      }
    } else if (tabsStore.contextMenu.rule) {
      // 単体変更
      const rule = tabsStore.contextMenu.rule

      const result = tabsStore.handleUpdateRule(rule.key, {
        ...rule,
        accessLevel: level,
      })

      if (result?.updatedName) {
        swalToast.success({
          title: `「${result.updatedName}」のアクセスレベルを「${level}」に変更しました`,
        })
      }
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
