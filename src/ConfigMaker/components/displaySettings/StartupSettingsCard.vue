<!-- src/ConfigMaker/components/display/StartupSettingsCard.vue -->
<template>
 <div class="card bg-base-300">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">起動時設定</div>
  <div class="card-body space-y-4">
   <SettingItem
    label="モード"
    description="アプリケーション起動時のデフォルトモード"
    :showReset="false"
   >
    <select
     v-model="displaySettings.defaultScriptKey"
     class="select select-bordered w-full max-w-xs"
    >
     <option :value="null">BOTちゃん</option>
     <option v-for="(value, key) in scriptGameMap" :key="key" :value="key">
      {{ value.name }}({{ key }})
     </option>
    </select>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { scriptGameMap } from '@/ScriptGame/ScriptGameMap'; // scriptGameKeysも必要に応じてインポート
import { storeToRefs } from 'pinia';

// Store
const omikujiStore = useOmikujiStore();
const { data } = storeToRefs(omikujiStore);

// 表示設定の参照
const displaySettings = computed(() => data.value.displaySettings);
</script>
