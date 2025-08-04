<!-- src/ConfigMaker/components/display/AvailableGameScripts.vue -->
<template>
 <div class="card bg-base-300">
  <div class="card-title bg-warning text-warning-content text-lg p-2 pl-4 rounded-t">
   ゲームスクリプトの表示設定
  </div>
  <div class="card-body space-y-4">
   <!-- 利用可能なスクリプト切替 -->
   <SettingItem
    label="利用可能なスクリプト"
    description="有効にするスクリプトを切り替え"
    @reset="selectAllScripts"
   >
    <div
     v-for="(scriptPreset, scriptId) in scriptGameMap"
     :key="scriptId"
     class="flex items-center justify-between bg-base-200 p-3 rounded shadow"
    >
     <span class="font-mono">{{ scriptPreset.name }} / {{ scriptId }}</span>
     <input
      type="checkbox"
      class="toggle toggle-warning"
      :value="scriptId"
      v-model="availableGameScripts"
     />
    </div>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { storeToRefs } from 'pinia';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 表示設定
const availableGameScripts = computed({
 get() {
  return data.value.displaySettings.developer.availableGameScripts;
 },
 set(newValue: string[]) {
  data.value.displaySettings.developer.availableGameScripts = newValue;
 }
});

// 全スクリプトを ON にする
function selectAllScripts() {
 const allKeys = Object.keys(scriptGameMap);
 availableGameScripts.value = allKeys; // ここでsetterが呼ばれる
}
</script>
