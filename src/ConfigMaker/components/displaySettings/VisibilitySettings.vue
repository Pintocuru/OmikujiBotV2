<!-- src/ConfigMaker/components/display/VisibilitySettings.vue -->
<template>
 <div class="card bg-base-300">
  <div class="card-title bg-warning text-warning-content text-lg p-2 pl-4 rounded-t">
   コンポーネント可視性設定
  </div>
  <div class="card-body space-y-4">
   <!-- 基本コンポーネントの可視性 -->
   <SettingItem
    label="基本コンポーネント表示"
    description="各種コンポーネントの表示・非表示を制御"
    @reset="resetBasicVisibility"
   >
    <div class="grid grid-cols-2 gap-4">
     <label
      v-for="category in basicCategories"
      :key="category"
      class="label cursor-pointer justify-start gap-3 bg-base-200 p-3 rounded"
     >
      <input
       v-model="visibilitySettings[category]"
       type="checkbox"
       class="toggle toggle-warning toggle-sm"
      />
      <span class="label-text capitalize">{{ getCategoryDisplayName(category) }}</span>
     </label>
    </div>
   </SettingItem>

   <!-- ゲームスクリプト関連設定 -->
   <SettingItem
    label="ゲームスクリプト設定"
    description="ゲームスクリプト関連の表示制御"
    @reset="resetGameScriptSettings"
   >
    <div class="space-y-3">
     <!-- ゲームスクリプト設定UI表示制御 -->
     <label class="label cursor-pointer justify-start gap-3 bg-base-200 p-3 rounded">
      <input
       v-model="visibilitySettings.gameScriptSettings"
       type="checkbox"
       class="toggle toggle-warning toggle-sm"
      />
      <span class="label-text">ゲームスクリプトの設定UI</span>
     </label>

     <!-- 利用可能なゲームスクリプト -->
     <div class="bg-base-200 p-3 rounded">
      <div class="mb-2 font-semibold">利用可能なゲームスクリプト</div>
      <div class="grid grid-cols-1 gap-2">
       <label
        v-for="(scriptPreset, scriptId) in gameScriptMap"
        :key="scriptId"
        class="label cursor-pointer justify-between bg-base-100 p-2 rounded text-sm"
       >
        <span class="font-mono">{{ scriptPreset.name }} / {{ scriptId }}</span>
        <input
         type="checkbox"
         class="toggle toggle-warning toggle-xs"
         :value="scriptId"
         v-model="gameScriptsArray"
        />
       </label>
      </div>
     </div>
    </div>
   </SettingItem>

   <!-- その他設定 -->
   <SettingItem
    label="その他設定"
    description="その他のコンポーネント表示制御"
    @reset="visibilitySettings.wordPartySettings = true"
   >
    <label class="label cursor-pointer justify-start gap-3 bg-base-200 p-3 rounded">
     <input
      v-model="visibilitySettings.wordPartySettings"
      type="checkbox"
      class="toggle toggle-warning toggle-sm"
     />
     <span class="label-text">Word Party Settings</span>
    </label>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/GameScriptsMap';
import { storeToRefs } from 'pinia';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 基本カテゴリ（displaySettings と meta を除く）
const basicCategories = ['comments', 'timers', 'placeholders', 'characters'] as const;

// 可視性設定の参照
const visibilitySettings = computed({
 get: () => data.value.displaySettings.developer.visibility,
 set: (newValue) => {
  omikujiStore.updateDisplaySettings({
   developer: {
    ...data.value.displaySettings.developer,
    visibility: newValue
   }
  });
 }
});

// ゲームスクリプト配列の処理
const gameScriptsArray = computed({
 get: () => visibilitySettings.value.gameScripts,
 set: (newValue: string[]) => {
  visibilitySettings.value = {
   ...visibilitySettings.value,
   gameScripts: newValue
  };
 }
});

// カテゴリ表示名の取得
function getCategoryDisplayName(category: string): string {
 const displayNames: Record<string, string> = {
  comments: 'Comments',
  timers: 'Timers',
  placeholders: 'Placeholders',
  characters: 'Characters'
 };
 return displayNames[category] || category;
}

// リセット関数
function resetBasicVisibility() {
 const resetVisibility = { ...visibilitySettings.value };
 basicCategories.forEach((category) => {
  resetVisibility[category] = true;
 });
 visibilitySettings.value = resetVisibility;
}

function resetGameScriptSettings() {
 visibilitySettings.value = {
  ...visibilitySettings.value,
  gameScripts: [],
  gameScriptSettings: true
 };
}
</script>
