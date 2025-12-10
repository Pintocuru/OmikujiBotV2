<!-- src\ConfigMaker\components\displaySettings\components\ComponentConditionsEditor.vue -->
<template>
  <!-- コンポーネント表示設定 -->
  <SettingItem label="適用する発動条件" description="トリガーの種類を選択">
    <div class="flex flex-wrap gap-2">
      <label
        v-for="condition in settingsComponentsCondition"
        :key="condition"
        class="flex items-center gap-2 hover:bg-base-300 p-2 rounded cursor-pointer"
      >
        <input
          type="checkbox"
          class="checkbox checkbox-primary"
          :checked="conditions.includes(condition)"
          @change="toggleCondition(condition)"
        />
        <span class="text-sm">{{ condition }}</span>
      </label>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { settingsComponentsCondition, SettingsComponentsCondition } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 個別のcomputed値
  const conditions = computed(() => data.value.displaySettings.components.conditions)

  // 汎用的な更新関数
  const toggleCondition = (condition: SettingsComponentsCondition) => {
    const newConditions = conditions.value.includes(condition)
      ? conditions.value.filter((c) => c !== condition)
      : [...conditions.value, condition]

    omikujiStore.updateNestedDisplaySettings('components', {
      ...data.value.displaySettings.components,
      conditions: newConditions,
    })
  }
</script>
