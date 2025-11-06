<!-- src/ConfigMaker/components/display/StartupSettings.vue -->
<template>
  <!-- 起動時に表示するコンポーネント -->
  <SettingItem
    label="起動時コンポーネント"
    description="アプリケーション起動時に表示するコンポーネント"
    :showReset="true"
    @reset="startupSettings.component = 'omikujiBot'"
  >
    <select v-model="startupSettings.component" class="select select-bordered w-full max-w-xs">
      <option value="omikujiBot">おみくじBot</option>
      <option value="gameScript">ゲームスクリプト</option>
    </select>
  </SettingItem>

  <!-- デフォルトスクリプトキー (gameScript選択時のみ表示) -->
  <SettingItem
    v-if="startupSettings.component === 'gameScript'"
    label="デフォルトスクリプト"
    description="gameScript選択時のデフォルトスクリプト"
    :showReset="true"
    @reset="startupSettings.scriptKey = null"
  >
    <select v-model="startupSettings.scriptKey" class="select select-bordered w-full max-w-xs">
      <option :value="null">選択なし(nullの時はおみくじBOTが表示されます)</option>
      <option v-for="(value, key) in gameScriptMap" :key="key" :value="key">{{ value.name }}({{ key }})</option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { gameScriptMap } from '@/common/GameScripts/GameScriptsMap'
  import { storeToRefs } from 'pinia'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 起動設定の参照
  const startupSettings = computed({
    get: () => data.value.displaySettings.developer.startup,
    set: (newValue) => {
      omikujiStore.updateDisplaySettings({
        developer: {
          ...data.value.displaySettings.developer,
          startup: newValue,
        },
      })
    },
  })
</script>
