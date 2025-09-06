<!-- src\ConfigMaker\components\displaySettings\ToastBubbleEditor.vue -->
<template>
  <!-- トースト・サムネイルサンプル表示 -->

  <!-- トースト表示 -->
  <SettingItem
    label="トースト通知"
    description="画面上部に通知メッセージを表示します"
    :showReset="true"
    @reset="resetMap.showToasts"
  >
    <label class="label cursor-pointer justify-start gap-3">
      <input
        :checked="base.showToasts"
        @change="(e) => updateBaseField('showToasts', (e.target as HTMLInputElement).checked)"
        type="checkbox"
        class="toggle toggle-primary"
      />
      <span class="label-text">トースト通知を表示する</span>
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
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { storeToRefs } from 'pinia'
  import { BaseSettingsSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'

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
    showToasts: () => resetField('showToasts'),
    showCharacterThumbnail: () => resetField('showCharacterThumbnail'),
  }
</script>
