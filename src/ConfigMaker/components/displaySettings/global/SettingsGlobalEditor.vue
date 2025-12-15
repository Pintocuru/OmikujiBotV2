<!-- src\ConfigMaker\components\displaySettings\global\SettingsGlobalEditor.vue -->
<template>
  <!-- フォントファミリー -->
  <SettingItem
    label="フォントファミリー"
    description="表示に使用するフォントを設定します"
    forceMode="pro"
    :showReset="true"
    @reset="resetMap.fontFamily"
  >
    <select
      :value="global.fontFamily"
      @change="(e) => updateGlobalField('fontFamily', (e.target as HTMLSelectElement).value)"
      class="select bg-base text-base-content w-full max-w-xs"
      :disabled="!isPro"
    >
      <option v-for="font in fontFamilyOptions" :key="font" :value="font">
        {{ fontFamilyLabels[font] }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { fontFamilyOptions, fontFamilyLabels } from '@/types/BotComponents/useFontFamily'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { storeToRefs } from 'pinia'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { SettingsGlobalSchema } from '@/types/OmikujiData/DisplaySettingsSchema'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro } = useSettingMode()

  // 個別のcomputed値（読み取り専用）
  const global = computed(() => data.value.displaySettings.global)

  // 更新関数
  const updateGlobalField = (field: keyof typeof global.value, value: any) => {
    omikujiStore.updateNestedDisplaySettings('global', {
      ...global.value,
      [field]: value,
    })
  }

  // リセット関数
  const resetField = (field: keyof typeof global.value) => {
    const defaults = SettingsGlobalSchema.parse({})
    updateGlobalField(field, defaults[field])
  }

  // フィールドごとのリセット関数マップ
  const resetMap = {
    fontFamily: () => resetField('fontFamily'),
  }
</script>
