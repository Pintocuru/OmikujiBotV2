<!-- src/configMaker/components/placeholders/PlaceholderInputMode.vue -->
<template>
 <div class="space-y-1 max-h-128 overflow-y-auto">
  <div v-for="(value, index) in localValues" :key="index" class="card bg-base-100 p-2">
   <div class="flex flex-col sm:flex-row sm:items-center sm:gap-2">
    <!-- 重み (パーセンテージ表示) -->
    <div class="w-full sm:w-32">
     <label class="text-xs text-gray-500 mb-1 block">
      重み ({{ getWeightPercentage(value.weight) }}%)
     </label>
     <input
      type="number"
      v-model.number="value.weight"
      min="0"
      class="input input-bordered input-sm w-full"
      placeholder="重み"
     />
    </div>

    <!-- 内容 -->
    <div class="flex-1">
     <label class="text-xs text-gray-500 mb-1 block">内容</label>
     <input
      type="text"
      v-model="value.content"
      placeholder="プレースホルダーの内容"
      class="input input-bordered input-sm w-full"
     />
    </div>

    <!-- 複製・削除ボタン -->
    <div class="mt-2 sm:mt-0 sm:ml-auto">
     <MenuDropdown
      :disableDelete="localValues.length <= 1"
      @duplicate="$emit('duplicate-value', index)"
      @delete="$emit('remove-value', index)"
     />
    </div>
   </div>
  </div>

  <button @click="$emit('add-value')" class="btn btn-primary btn-sm w-full">+ 値を追加</button>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { PlaceholderValueType } from '@/types/';
import MenuDropdown from '@ConfigComponents/parts/MenuDropdown.vue';

const props = defineProps<{
 localValues: Array<PlaceholderValueType>;
}>();

defineEmits<{
 'add-value': [];
 'remove-value': [index: number];
 'duplicate-value': [index: number];
}>();

// 全体の重みの合計を計算
const totalWeight = computed(() => {
 return props.localValues.reduce((sum, item) => sum + (item.weight || 0), 0);
});

// 各項目の重みのパーセンテージを計算
const getWeightPercentage = (weight: number) => {
 if (totalWeight.value === 0) return '0.00';
 return ((weight / totalWeight.value) * 100).toFixed(2);
};
</script>
