<!-- src/configMaker/components/parts/ColorPicker.vue -->
<template>
 <div class="relative">
  <button
   class="btn btn-sm btn-square border-2 border-white/20"
   :style="{ backgroundColor: modelValue }"
   title="エディターカラー"
   @click="showPicker = !showPicker"
  >
   🎨
  </button>

  <!-- カラーピッカー -->
  <div
   v-if="showPicker"
   class="absolute top-full left-0 mt-2 z-50 bg-base-100 p-4 rounded-lg shadow-lg border w-64"
  >
   <div class="grid grid-cols-6 gap-2 mb-3">
    <button
     v-for="color in presetColors"
     :key="color"
     class="w-6 h-6 rounded-full border-2"
     :class="modelValue === color ? 'border-white' : 'border-gray-400'"
     :style="{ backgroundColor: color }"
     @click="$emit('update:modelValue', color)"
    />
   </div>
   <input
    type="color"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement)?.value)"
    class="w-full h-8 cursor-pointer"
   />
  </div>

  <!-- 外側クリック検知 -->
  <div v-if="showPicker" class="fixed inset-0 z-40" @click="showPicker = false" />
 </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
 modelValue: string;
}>();

defineEmits<{
 'update:modelValue': [value: string];
}>();

const showPicker = ref(false);

// プリセットカラー
const presetColors = [
 '#3B82F6', // Blue
 '#EF4444', // Red
 '#10B981', // Green
 '#F59E0B', // Yellow
 '#8B5CF6', // Purple
 '#EC4899', // Pink
 '#06B6D4', // Cyan
 '#84CC16', // Lime
 '#F97316', // Orange
 '#6B7280', // Gray
 '#1F2937', // Dark Gray
 '#000000' // Black
];
</script>
