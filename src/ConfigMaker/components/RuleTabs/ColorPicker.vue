<!-- src/configMaker/components/RuleTabs/ColorPicker.vue -->
<template>
 <div class="w-full">
  <!-- カラーパレット（プリセットカラー） -->
  <div class="grid grid-cols-8 gap-2 mb-3">
   <button
    v-for="color in presetColors"
    :key="color"
    class="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform"
    :class="[
     modelValue === color ? 'border-white shadow-lg' : 'border-gray-400',
     'hover:border-white'
    ]"
    :style="{ backgroundColor: color }"
    :title="`カラー: ${color}`"
    @click="updateColor(color)"
   />
  </div>

  <!-- カスタムカラー選択 -->
  <div class="flex items-center gap-2">
   <label class="text-xs text-base-content/70 flex-shrink-0">カスタム:</label>
   <input
    type="color"
    :value="modelValue || '#3B82F6'"
    @input="updateColor(($event.target as HTMLInputElement)?.value)"
    class="w-8 h-6 rounded border border-base-300 cursor-pointer hover:border-base-400"
   />
   <span class="text-xs font-mono text-base-content/50">{{ modelValue || '#3B82F6' }}</span>
  </div>

  <!-- クリア/リセットボタン -->
  <div class="flex gap-2 mt-2">
   <button
    @click="updateColor(defaultColor)"
    class="btn btn-xs btn-outline flex-1"
    :disabled="modelValue === defaultColor"
   >
    デフォルト
   </button>
   <button v-if="modelValue" @click="updateColor('')" class="btn btn-xs btn-ghost flex-1">
    クリア
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
const props = defineProps<{
 modelValue?: string;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: string];
}>();

// デフォルトカラー
const defaultColor = '#3B82F6';

// プリセットカラー（よく使用される色を厳選）
const presetColors = [
 '#3B82F6', // Blue - デフォルト
 '#EF4444', // Red - エラー/重要
 '#10B981', // Green - 成功/完了
 '#F59E0B', // Yellow - 警告/注意
 '#8B5CF6', // Purple - 特別/上級
 '#EC4899', // Pink - 強調
 '#06B6D4', // Cyan - 情報
 '#84CC16', // Lime - 新規/追加
 '#F97316', // Orange - アクション
 '#6366F1', // Indigo - プライマリ
 '#6B7280', // Gray - 無効/通常
 '#1F2937' // Dark Gray - システム
];

// カラー更新
const updateColor = (color: string) => {
 emit('update:modelValue', color);
};
</script>
