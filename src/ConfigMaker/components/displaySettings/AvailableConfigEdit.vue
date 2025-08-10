<!-- src/ConfigMaker/components/display/AvailableConfigEdit.vue -->
<template>
 <div class="card bg-base-300">
  <div class="card-title bg-warning text-warning-content text-lg p-2 pl-4 rounded-t">
   コンフィグエディター機能の有効・無効設定
  </div>
  <div class="card-body space-y-4">
   <!-- 起動時に表示するコンポーネント -->
   <SettingItem
    label="起動時コンポーネント"
    description="アプリケーション起動時に表示するコンポーネント"
    @reset="developerSettings.selectComponent = 'omikujiBot'"
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
    @reset="developerSettings.enabledGameScriptSettings = false"
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

// 開発者設定の参照
const developerSettings = computed({
 get: () => data.value.displaySettings.developer,
 set: (newValue) => {
  omikujiStore.updateDisplaySettings({
   developer: {
    ...newValue,
    availableGameScripts: [...newValue.availableGameScripts]
   }
  });
 }
});
</script>
