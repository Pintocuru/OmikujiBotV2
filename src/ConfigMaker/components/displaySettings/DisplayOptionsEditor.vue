<!-- src/ConfigMaker/components/display/DisplayOptionsEditor.vue -->
<template>
  <!-- 表示オプション -->
  <SectionCard>
    <template #header>
      <div>表示オプション</div>
      <div class="text-sm pr-2">ジェネレーターで表示する、フキダシ以外の表示設定です</div>
    </template>

    <template #body>
      <!-- キャラクター背景色の使用 -->
      <SettingItem
        v-if="useVisibilityAccess().canShow('characterVisible')"
        label="キャラクター画像の背景色"
        description="キャラ画像の背景に色を付けるかを設定します"
        devMemo="characterVisible"
        :showReset="true"
        @reset="resetMap.useCharacterBgColor"
      >
        <label class="label cursor-pointer justify-start gap-3">
          <input
            :checked="base.useCharacterBgColor"
            @change="(e) => updateBaseField('useCharacterBgColor', (e.target as HTMLInputElement).checked)"
            type="checkbox"
            class="toggle toggle-primary"
          />
          <span class="label-text">背景色を付ける</span>
        </label>
      </SettingItem>

      <!-- キャラクターサムネイル表示 -->
      <SettingItem
        v-if="useVisibilityAccess().canShow('characterVisible')"
        label="キャラクターサムネイル"
        description="右下にキャラクターのサムネイルを表示します"
        devMemo="characterVisible"
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
          <span class="label-text">キャラクターアイコンを表示する</span>
        </label>
      </SettingItem>

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
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
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
    useCharacterBgColor: () => resetField('useCharacterBgColor'),
    showCharacterThumbnail: () => resetField('showCharacterThumbnail'),
    showToasts: () => resetField('showToasts'),
  }
</script>
