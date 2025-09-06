<!-- src\ConfigMaker\components\displaySettings\ShowCharacterEditor.vue -->
<template>
  <!-- キャラクターサンプル表示 -->
  <CharacterPreview
    :characters="data.characters"
    :showCharacterPersistent="base.showCharacterPersistent"
    :showCharacterFrame="base.showCharacterFrame"
    :showCharacterThumbnail="base.showCharacterThumbnail"
    :bundleCharacters="base.bundleCharacters"
    :displaySize="base.displaySize"
    :maxDisplayCount="5"
  />

  <!-- キャラクター画像の常時表示 -->
  <SettingItem
    label="キャラクター画像の常時表示"
    description="起動時にキャラクター画像を表示するか"
    :showReset="true"
    @reset="resetMap.showCharacterPersistent"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showCharacterPersistent"
        @change="(e) => updateBaseField('showCharacterPersistent', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">キャラクターを常時表示する</span>
    </label>
  </SettingItem>

  <!-- キャラクターフレームの使用 -->
  <SettingItem
    label="キャラクター画像の背景色"
    description="キャラ画像の背景に色を付けるかを設定します"
    :showReset="true"
    @reset="resetMap.showCharacterFrame"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showCharacterFrame"
        @change="(e) => updateBaseField('showCharacterFrame', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">背景色を付ける</span>
    </label>
  </SettingItem>

  <!-- キャラクターサムネイル表示 -->
  <SettingItem
    label="キャラクターサムネイル"
    description="右下にキャラクターのサムネイルを表示します"
    :showReset="true"
    @reset="resetMap.showCharacterThumbnail"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showCharacterThumbnail"
        @change="(e) => updateBaseField('showCharacterThumbnail', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">キャラクターサムネイルを表示する</span>
    </label>
  </SettingItem>

  <!-- キャラクター統合モード -->
  <SettingItem
    label="キャラクター統合モード"
    description="複数のキャラクターを1箇所にまとめるかを設定します"
    :showReset="true"
    @reset="resetMap.bundleCharacters"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.bundleCharacters"
        @change="(e) => updateBaseField('bundleCharacters', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">キャラクターを1つにまとめる</span>
    </label>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import CharacterPreview from './CharacterPreview.vue'
  import { storeToRefs } from 'pinia'
  import { BaseSettingsSchema } from '@/types/OmikujiData/DisplaySettingsSchema'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 個別のcomputed値（読み取り専用）
  const base = computed(() => data.value.displaySettings.base)

  // 汎用的な更新関数
  const updateBaseField = (field: keyof typeof base.value, value: any) => {
    omikujiStore.updateDisplaySettings({
      base: {
        ...base.value,
        [field]: value,
      },
    })
  }

  // 共通リセット関数
  const resetField = (field: keyof typeof base.value) => {
    const schemaDefaults = BaseSettingsSchema.parse({})
    const defaultValue = schemaDefaults[field]
    updateBaseField(field, defaultValue)
  }

  // フィールドごとのリセット関数マップ
  const resetMap = {
    showCharacterFrame: () => resetField('showCharacterFrame'),
    showCharacterPersistent: () => resetField('showCharacterPersistent'),
    showCharacterThumbnail: () => resetField('showCharacterThumbnail'),
    bundleCharacters: () => resetField('bundleCharacters'),
  }
</script>
