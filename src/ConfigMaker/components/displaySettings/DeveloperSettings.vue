<!-- src/ConfigMaker/components/display/DeveloperSettings.vue -->
<template>
 <div class="card bg-base-300">
  <div class="card-title bg-warning text-warning-content text-lg p-2 pl-4 rounded-t">
   開発者設定 (GOD-MODE)
  </div>
  <div class="card-body space-y-4">
   <!-- 開発者モードの有効化 -->
   <SettingItem
    label="開発者モード"
    description="配布されてるほぼすべてのモードに設定可能"
    :showReset="false"
   >
    <label class="label cursor-pointer justify-start gap-3">
     <input
      v-model="developerSettings.godModeEnabled"
      type="checkbox"
      class="toggle toggle-warning"
     />
     <span class="label-text"
      >OFFにすると、この「開発者設定」の表示が「警告なしに」消えます</span
     ></label
    >
   </SettingItem>

   <!-- 起動時に表示するコンポーネント -->
   <SettingItem
    label="起動時コンポーネント"
    description="アプリケーション起動時に表示するコンポーネント"
    :showReset="false"
   >
    <select
     v-model="developerSettings.selectComponent"
     class="select select-bordered w-full max-w-xs"
    >
     <option value="omikujiBot">おみくじBot</option>
     <option value="gameScript">ゲームスクリプト</option>
    </select>
   </SettingItem>

   <!-- デフォルトスクリプトキー (gameScript選択時のみ表示) -->
   <SettingItem
    v-if="developerSettings.selectComponent === 'gameScript'"
    label="デフォルトスクリプト"
    description="gameScript選択時のデフォルトスクリプト"
    :showReset="false"
   >
    <select
     v-model="developerSettings.defaultScriptKey"
     class="select select-bordered w-full max-w-xs"
    >
     <option :value="null">選択なし(nullの時はおみくじBOTが表示されます)</option>
     <option v-for="(value, key) in gameScriptMap" :key="key" :value="key">
      {{ value.name }}({{ key }})
     </option>
    </select>
   </SettingItem>

   <!-- ゲームスクリプト設定UI表示制御 -->
   <SettingItem
    label="ゲームスクリプト設定の表示"
    description="OFFにすると、ゲームスクリプトの設定が非表示になります"
    :showReset="false"
   >
    <label class="label cursor-pointer justify-start gap-3">
     <input
      v-model="developerSettings.enabledGameScriptSettings"
      type="checkbox"
      class="toggle toggle-warning"
     />
     <span class="label-text">OFFにすると、ゲームスクリプトの設定が非表示になります</span></label
    >
   </SettingItem>

   <!-- テンプレート出力ボタン表示制御 -->
   <SettingItem
    label="テンプレート出力ボタン"
    description="有料版の機能「テンプレート出力」を表示するか"
    :showReset="false"
   >
    <label class="label cursor-pointer justify-start gap-3">
     <input
      v-model="developerSettings.showTemplateButton"
      type="checkbox"
      class="toggle toggle-warning" />
     <span class="label-text"></span
    ></label>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { gameScriptMap } from '@/ConfigMaker/components/GameScripts/ScriptGameMap';
import { storeToRefs } from 'pinia';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 開発者設定の参照
const developerSettings = computed({
 get() {
  return data.value.displaySettings.developer;
 },
 set(newValue) {
  omikujiStore.updateDisplaySettings({
   developer: {
    ...newValue,
    availableGameScripts: [...newValue.availableGameScripts]
   }
  });
 }
});
</script>
