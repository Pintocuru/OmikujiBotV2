<!-- src/configMaker/components/comments/OmikujiSetBasic.vue -->
<template>
 <div class="flex items-center gap-4">
  <!-- ドラッグハンドル -->
  <div
   class="cursor-move text-base-content/50 hover:text-base-content"
   draggable="true"
   @dragstart="$emit('dragstart', $event)"
   @dragend="$emit('dragend')"
  >
   <GripVertical class="w-5 h-5" />
  </div>

  <!-- 名前 -->
  <div class="form-control flex-1">
   <SettingItem label="おみくじ名" description="識別しやすい名前を入力" :show-reset="false">
    <input
     type="text"
     :value="omikuji.name"
     @input="$emit('update:name', ($event.target as HTMLInputElement).value)"
     placeholder="おみくじ名"
     class="input input-bordered input-sm w-full"
    />
   </SettingItem>
  </div>

  <!-- 重み -->
  <div class="form-control flex-1">
   <SettingItem
    :label="`重み (${weightPercentage}%)`"
    description="数値が高いほど出やすくなります"
    :show-reset="false"
   >
    <input
     type="number"
     :value="omikuji.weight"
     @input="$emit('update:weight', parseFloat(($event.target as HTMLInputElement).value))"
     min="0"
     class="input input-bordered input-sm w-full"
    />
   </SettingItem>
  </div>

  <!-- メニュー -->
  <div class="ml-auto">
   <MenuDropdown
    :disable-delete="disableDelete"
    @duplicate="$emit('duplicate')"
    @delete="$emit('delete')"
   />
  </div>
 </div>
</template>

<script setup lang="ts">
import { OmikujiSetType } from '@/types/';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import MenuDropdown from '@ConfigComponents/parts/MenuDropdown.vue';
import { GripVertical } from 'lucide-vue-next';
import { computed } from 'vue';

const props = defineProps<{
 allOmikuji: OmikujiSetType[];
 omikuji: OmikujiSetType;
 disableDelete: boolean;
}>();

defineEmits<{
 dragstart: [event: DragEvent];
 dragend: [];
 'update:name': [value: string];
 'update:weight': [value: number];
 duplicate: [];
 delete: [];
}>();

// 全体の重みの合計を計算
const totalWeight = computed(() => {
 return props.allOmikuji.reduce((sum, item) => sum + (item.weight || 0), 0);
});

// 現在のおみくじの出現率を計算
const weightPercentage = computed(() => {
 if (totalWeight.value === 0) return '0.00';
 return ((props.omikuji.weight / totalWeight.value) * 100).toFixed(2);
});
</script>
