<!-- src/ConfigMaker/components/display/DeveloperModeSettings.vue -->
<template>
  <div class="card bg-base-300">
    <div class="card-title bg-warning text-warning-content text-lg p-2 pl-4 rounded-t">開発者設定 (GOD-MODE)</div>
    <div class="card-body space-y-4">
      <!-- 開発者モードの有効化 -->
      <SettingItem
        label="開発者モード"
        description="配布されてるほぼすべてのモードに設定可能"
        @reset="developerSettings.godModeEnabled = false"
      >
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="developerSettings.godModeEnabled" type="checkbox" class="toggle toggle-warning" />
          <span class="label-text"> OFFにすると、この「開発者設定」の表示が「警告なしに」消えます </span>
        </label>
      </SettingItem>

      <!-- プロ版モード -->
      <SettingItem
        label="プロ版モード"
        description="有料版の機能を表示するか"
        @reset="developerSettings.proModeEnabled = false"
      >
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="developerSettings.proModeEnabled" type="checkbox" class="toggle toggle-secondary" />
          <span class="label-text"> テンプレート出力、Metaタグ編集が使えるようになります </span>
        </label>
      </SettingItem>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 開発者設定の参照
  const developerSettings = computed({
    get: () => data.value.displaySettings.developer,
    set: (newValue) => {
      omikujiStore.updateDisplaySettings({
        developer: newValue,
      })
    },
  })
</script>
