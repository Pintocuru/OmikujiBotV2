<!-- src/ConfigMaker/components/RecordTabs/ColorPicker.vue -->
<template>
  <div class="px-4 py-2">
    <div class="text-sm text-base-content/70 mb-2">カラー設定</div>

    <!-- カラーパレット（プリセットカラー） -->
    <div class="grid grid-cols-8 gap-2 mb-3">
      <button
        v-for="color in presetColors"
        :key="color"
        class="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform"
        :class="[
          modelValue === color ? 'border-3 scale-110 border-white shadow-lg' : 'border-gray-400',
          'hover:border-white',
        ]"
        :style="{ backgroundColor: color }"
        :title="`カラー: ${color}`"
        @click="updateColor(color)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useRecordTabsStore } from './RecordTabsStore'

  defineProps<{
    modelValue?: string
  }>()

  // Store
  const tabsStore = useRecordTabsStore()

  // プリセットカラー（よく使用される色を厳選）
  const presetColors = [
    // Normal (500)
    '#F44336', // Red 500
    '#FF9800', // Orange 500
    '#4CAF50', // Green 500
    '#00BCD4', // Cyan 500
    '#2196F3', // Blue 500
    '#3F51B5', // Indigo 500
    '#9C27B0', // Purple 500
    '#9E9E9E', // Gray 500

    // Light (200)
    '#EF9A9A', // Red 200
    '#FFCC80', // Orange 200
    '#A5D6A7', // Green 200
    '#80DEEA', // Cyan 200
    '#90CAF9', // Blue 200
    '#9FA8DA', // Indigo 200
    '#CE93D8', // Purple 200
    '#E0E0E0', // Gray 200

    // Dark (900)
    '#B71C1C', // Red 900
    '#E65100', // Orange 900
    '#1B5E20', // Green 900
    '#006064', // Cyan 900
    '#0D47A1', // Blue 900
    '#1A237E', // Indigo 900
    '#4A148C', // Purple 900
    '#212121', // Gray 900
  ]

  // マルチセレクトモードかどうかを判定
  const isMultiSelectActive = computed(() => tabsStore.isMultiSelectMode && tabsStore.selectedRuleIds.size > 0)

  // カラー更新（単体 or 一括を自動判定）
  const updateColor = (color: string) => {
    if (isMultiSelectActive.value) {
      // マルチセレクト時：一括更新
      tabsStore.handleBulkColorChange(color)
    } else if (tabsStore.contextMenu.rule) {
      // 単体選択時：個別更新
      tabsStore.handleUpdateRule(tabsStore.contextMenu.rule.key, {
        ...tabsStore.contextMenu.rule,
        editorColor: color,
      })
    }
  }
</script>
