<!-- src/ConfigMaker/components/display/DisplayOptionsEditor.vue -->
<template>
  <!-- 表示オプション -->
  <SectionCard>
    <template #header>
      <div>表示オプション</div>
      <div class="text-sm pr-2">ジェネレーターで表示する、フキダシ以外の表示設定です</div>
    </template>

    <template #body>
      <!-- キャラクターアイコン表示 -->
      <SettingItem
        v-if="useVisibilityAccess().canShow('characterVisible')"
        label="キャラクターアイコン"
        description="右下にキャラクターのサムネイルを表示します"
        devMemo="characterVisible"
        :showReset="true"
        @reset="resetMap.showCharacterIcon"
      >
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="base.showCharacterIcon" type="checkbox" class="toggle toggle-primary" />
          <span class="label-text">キャラクターアイコンを表示する</span>
        </label>
      </SettingItem>

      <!-- トースト表示 -->
      <SettingItem label="トースト通知" description="画面上部に通知メッセージを表示します" @reset="resetMap.showToasts">
        <label class="label cursor-pointer justify-start gap-3">
          <input v-model="base.showToasts" type="checkbox" class="toggle toggle-primary" />
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

  // 基本設定の参照
  const base = computed({
    get: () => data.value.displaySettings.base,
    set: (newValue) => {
      omikujiStore.updateDisplaySettings({
        base: {
          ...data.value.displaySettings.base,
          ...newValue,
        },
      })
    },
  })

  // 共通リセット関数
  const resetField = (field: keyof typeof base.value) => {
    const schemaDefaults = BaseSettingsSchema.parse({})
    const defaultValue = schemaDefaults[field]

    base.value = {
      ...base.value,
      [field]: defaultValue,
    }
  }

  // フィールドごとのリセット関数マップ
  const resetMap = {
    showCharacterIcon: () => resetField('showCharacterIcon'),
    showToasts: () => resetField('showToasts'),
  }
</script>
