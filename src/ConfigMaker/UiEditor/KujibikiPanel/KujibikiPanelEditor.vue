<!-- src/ConfigMaker/UiEditor/KujibikiPanel/KujibikiPanelEditor.vue -->
<template>
  <!-- プレビュー -->
  <KujibikiPanelPreview :settings="kujibikiPanel" />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="kujibikiPanel.component"
    :options="kujibikiComponentMap"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- フキダシアニメーション -->
  <SettingItem label="フキダシアニメーション" description="フキダシの表示アニメーションを設定します" forceMode="pro">
    <select
      v-model="kujibikiPanel.animation"
      @change="updateField('animation', ($event.target as HTMLSelectElement).value)"
      class="select select-bordered w-full max-w-xs"
      :disabled="!isPro"
    >
      <option v-for="(value, key) in enterMotionMap" :key="key" :value="key">
        {{ value.label }}
      </option>
    </select>
  </SettingItem>

  <!-- タイマー初期値 -->
  <SettingItem label="タイマー初期値（分）" description="1〜60分">
    <input
      type="number"
      class="input input-bordered w-24"
      :value="kujibikiPanel.displaySeconds"
      min="0"
      max="60"
      @change="(e) => updateField('displaySeconds', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { KujibikiPanelType, KujibikiPanelSchema, kujibikiComponentMap } from '@/types'
  import KujibikiPanelPreview from './KujibikiPanelPreview.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import DisplayStyleSelector from '../CommonStyle/DisplayStyleSelector.vue'
  import { enterMotionMap } from '@/types/MetaMaps/enterMotionMaps'
  import { useSettingMode } from '@/ConfigMaker/scripts/useAccessCheckerConfig'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro } = useSettingMode()

  const kujibikiPanel = computed<KujibikiPanelType>(
    () => data.value.components.settings.kujibikiPanel ?? KujibikiPanelSchema.parse({})
  )

  // Field update
  const updateField = (field: keyof KujibikiPanelType, value: unknown) => {
    omikujiStore.updateComponentSettings('kujibikiPanel', {
      ...kujibikiPanel.value,
      [field]: value,
    })
  }
</script>
