<!-- src/ConfigMaker/components/display/AutoSwitchSettingsCard.vue -->
<template>
 <div class="card bg-base-300">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">自動切り替え設定</div>
  <div class="card-body">
   <SettingItem
    label="自動切り替え間隔"
    description="モード間の自動切り替え頻度"
    @reset="resetAutoSwitchInterval"
   >
    <select
     v-model.number="displaySettings.autoSwitchInterval"
     class="select select-bordered w-full max-w-xs"
    >
     <option :value="0">切り替えしない</option>
     <option :value="15">15秒</option>
     <option :value="30">30秒</option>
     <option :value="60">1分</option>
     <option :value="120">2分</option>
     <option :value="180">3分</option>
     <option :value="300">5分</option>
    </select>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { DisplaySettingsSchema } from '@/types/';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { storeToRefs } from 'pinia';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 表示設定の参照
const displaySettings = computed(() => data.value.displaySettings);

// リセット機能（スキーマのデフォルト値を使用）
const resetAutoSwitchInterval = () => {
 displaySettings.value.autoSwitchInterval =
  DisplaySettingsSchema.shape.autoSwitchInterval.parse(undefined);
};
</script>
