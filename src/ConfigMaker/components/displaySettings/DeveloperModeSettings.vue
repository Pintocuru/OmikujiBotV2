<!-- src/ConfigMaker/components/display/DeveloperModeSettings.vue -->
<template>
  <SectionCard variant="warning">
    <template #header>
      <div>開発者設定 (GOD-MODE)</div>
    </template>

    <template #body>
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
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
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
