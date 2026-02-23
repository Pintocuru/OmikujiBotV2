<!-- src/ConfigMaker/components/appInfo/FeatureUsageSettings/UsageComponentsSettings.vue -->
<template>
  <SubSectionHeader icon="LayoutGrid" title="アイテム設定" description="ジェネレーターのアイテム表示制御" />

  <div class="space-y-4">
    <div v-for="group in groupedUiKinds" :key="group.slot" class="space-y-2">
      <h3 class="text-sm font-bold uppercase">
        {{ group.slot }}
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        <SettingItem
          v-for="[key, value] in group.items"
          :key="key"
          :label="value.label"
          :description="key"
          :variant="components.includes(key) ? undefined : 'neutral'"
        >
          <input type="checkbox" class="toggle toggle-warning toggle-sm" :value="key" v-model="components" />
        </SettingItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useFeatureUsageSettings } from './useFeatureUsageSettings'
  import { uiKindMap } from '@/types/'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { computed } from 'vue'

  const { components } = useFeatureUsageSettings()

  const slotOrder = ['primary', 'secondary', 'extra'] as const
  const groupedUiKinds = computed(() => {
    return slotOrder.map((slot) => ({
      slot,
      items: Object.entries(uiKindMap).filter(([, v]) => v.primarySlot === slot),
    }))
  })
</script>
