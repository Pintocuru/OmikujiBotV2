<!-- src\ConfigMaker\components\componentEditor\WinnerGroup\WinnerGroupEditor.vue -->
<template>
  <NoParamsCard v-if="!isComment" :message="'コメント機能を有効にしてください'" />

  <!-- プレビュー -->
  <div class="max-h-96 overflow-y-hidden" :data-theme="winnerGroup.color">
    <WinnerGroupRenderer :winnerSetting="winnerGroup" :users="previewUsers" />
  </div>

  <!-- コンポーネント選択 -->
  <SettingItem v-if="isPro" label="表示スタイル" description="カウンターの表示形式を選択" forceMode="pro">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(style, key) in winnerComponents"
        :key="key"
        class="badge cursor-pointer"
        :class="winnerGroup.component === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('component', key)"
      >
        {{ style }}
      </div>
    </div>
  </SettingItem>

  <!-- タイトル -->
  <SettingItem label="タイトル" description="タイトルを設定します" :showReset="true" @reset="resetMap.label">
    <input
      type="text"
      class="input input-bordered w-full"
      :value="winnerGroup.label"
      @input="(e) => updateField('label', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <!-- テーマカラー -->
  <SettingItem label="テーマカラー" description="テーマカラーを選択">
    <select
      class="select select-bordered"
      :value="winnerGroup.color"
      @change="(e) => updateField('color', (e.target as HTMLSelectElement).value)"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsWinnerGroupSchema, winnerComponents } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode, useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import WinnerGroupRenderer from '@main/ui/WinnerGroup/parts/WinnerGroupRenderer.vue'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import { generateDummyWinnerUsers } from '@/common/ui/GameRanking/useDummyBotMessages'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isComment } = useVisibilityAccess()
  const { isPro } = useSettingMode()

  const winnerGroup = computed(() => data.value.components.settings.winnerGroup)

  const previewUsers = generateDummyWinnerUsers(10)

  const updateField = (field: keyof typeof winnerGroup.value, value: any) => {
    omikujiStore.updateComponentSettings('winnerGroup', {
      ...winnerGroup.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof typeof winnerGroup.value) => {
    const defaults = SettingsWinnerGroupSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    component: () => resetField('component'),
    label: () => resetField('label'),
    color: () => resetField('color'),
  }
</script>
