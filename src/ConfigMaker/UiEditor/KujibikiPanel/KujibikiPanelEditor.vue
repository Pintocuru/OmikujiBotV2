<!-- src/ConfigMaker/UiEditor/KujibikiPanel/KujibikiPanelEditor.vue -->
<template>
  <!-- プレビュー -->
  <KujibikiPanelPreview :settings="kujibikiPanel" />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :key="kujibikiPanel.animation"
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

  <!-- タイトル -->
  <SettingItem label="タイトル" description="タイトルを設定します">
    <input
      type="text"
      class="input input-bordered w-full"
      :value="kujibikiPanel.label"
      @input="(e) => updateField('label', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <!-- 表示時間 -->
  <SettingItem label="表示時間（秒）" description="0なら常時表示します">
    <input
      type="number"
      class="input input-bordered w-24"
      :value="kujibikiPanel.displaySeconds"
      min="0"
      max="60"
      @change="(e) => updateField('displaySeconds', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>

  <!-- 画像系コンポーネント専用設定 -->
  <SettingItem v-if="isVisual" label="画像パス" description="顔ハメ看板のフレーム画像を指定します">
    <input
      type="text"
      class="input input-bordered w-full"
      :value="kujibikiPanel.imagePath"
      @input="(e) => updateField('imagePath', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <SettingItem v-if="isVisual" label="アイコンサイズ" description="中央に配置するアイコンの大きさを設定します">
    <div class="flex flex-col gap-2 w-full">
      <!-- スライダー -->
      <input
        type="range"
        min="16"
        max="512"
        step="8"
        class="range range-primary w-full"
        :value="kujibikiPanel.iconSize ?? 128"
        @input="(e) => updateField('iconSize', Number((e.target as HTMLInputElement).value))"
      />

      <!-- 現在値の表示 -->
      <div class="text-right text-sm opacity-70">{{ kujibikiPanel.iconSize ?? 128 }} px</div>
    </div>
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

  const isVisual = computed(() => {
    const comp = kujibikiPanel.value.component
    return kujibikiComponentMap[comp]?.isVisual === true
  })

  // Field update
  const updateField = (field: keyof KujibikiPanelType, value: unknown) => {
    omikujiStore.updateComponentSettings('kujibikiPanel', {
      ...kujibikiPanel.value,
      [field]: value,
    })
  }
</script>
