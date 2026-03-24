<!-- src/ConfigMaker/UiEditor/FlightSeat/FlightSeatEditor.vue -->
<template>
  <FlightSeatPreview />

  <!-- コンポーネント種別 -->
  <SettingItem v-if="isPro" label="レイアウト種別" description="座席の見た目を選択します" forceMode="pro">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in flightComponentMap"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="flightSeat.component === key ? 'badge-primary' : 'badge-outline'"
        @click="updateComponent(key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- プリセット選択 -->
  <template v-if="isPro && currentPresets">
    <SettingItem label="プリセット" description="座席レイアウトのプリセットを適用します" forceMode="pro">
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(preset, key) in currentPresets"
          :key="key"
          class="badge badge-lg cursor-pointer"
          :class="'badge-outline'"
          @click="updateField('customLayout', JSON.stringify(preset.layout))"
        >
          {{ preset.label }}
        </div>
      </div>
    </SettingItem>

    <!-- カスタムレイアウト（defaultが string のときのみ表示） -->
    <SettingItem
      v-if="isCustomizable"
      label="カスタムレイアウト"
      description="各行の座席数をJSON配列で指定します（例: [12, 13, 12]）"
      :showReset="true"
      @reset="resetField('customLayout')"
      forceMode="pro"
    >
      <input
        type="text"
        class="input input-bordered w-full font-mono text-sm"
        :value="flightSeat.customLayout ?? (flightComponentDefaults[flightSeat.component] as string)"
        :class="isValidLayout ? '' : 'input-error'"
        @input="(e) => updateField('customLayout', (e.target as HTMLInputElement).value)"
      />
      <div v-if="!isValidLayout" class="text-error text-xs mt-1">JSONの形式が正しくありません</div>
    </SettingItem>
  </template>

  <!-- 右下のステータス -->
  <SettingItem label="右下のステータス" description="アイコンの右下に表示する内容">
    <div class="flex flex-wrap gap-2">
      <div
        class="badge badge-lg cursor-pointer"
        :class="flightSeat.statKey === null ? 'badge-primary' : 'badge-outline'"
        @click="updateField('statKey', null)"
      >
        非表示
      </div>
      <div
        v-for="(label, key) in statKeyLabelMap"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="flightSeat.statKey === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('statKey', key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- テーマカラー -->
  <DaisyUiThemeEditor
    v-if="isAdv"
    :model-value="flightSeat.color"
    @update:model-value="(newValue) => updateField('color', newValue)"
  />

  <!-- 対象イベントキー -->
  <SettingItem
    v-if="isComment"
    label="対象イベントキー"
    description="対象とするイベントを指定します"
    :showReset="true"
    @reset="resetField('targetEventKey')"
  >
    <div class="flex flex-wrap gap-2">
      <div
        class="badge cursor-pointer"
        :class="flightSeat.targetEventKey === '' ? 'badge-primary' : 'badge-outline'"
        @click="updateField('targetEventKey', '')"
      >
        すべて
      </div>
      <div
        v-for="(value, key) in rulesComment"
        :key="key"
        class="badge cursor-pointer"
        :class="flightSeat.targetEventKey === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('targetEventKey', key)"
      >
        {{ value.name || '名称未設定' }}
      </div>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import {
    flightComponentMap,
    flightComponentDefaults,
    SettingsFlightSchema,
    SettingsFlightSeatType,
    FlightComponentKind,
    StatKeyNum,
    presets,
  } from '@/types/'
  import FlightSeatPreview from './FlightSeatPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode, useVisibilityAccess } from '@/ConfigMaker/scripts/useAccessCheckerConfig'
  import DaisyUiThemeEditor from '@config/components/common/ThemeColorPicker/DaisyUiThemeEditor.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const flightSeat = computed(() => SettingsFlightSchema.parse(data.value.components.settings.flightSeat ?? {}))
  const rulesComment = computed(() => data.value.comments)

  const { isAdv, isPro } = useSettingMode()
  const { isComment } = useVisibilityAccess()

  // defaultが string = カスタム可能
  const isCustomizable = computed(() => typeof flightComponentDefaults[flightSeat.value.component] === 'string')

  // customLayout のバリデーション
  const isValidLayout = computed(() => {
    const val = flightSeat.value.customLayout
    if (!val) return true
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) && parsed.every((n) => typeof n === 'number')
    } catch {
      return false
    }
  })

  const updateField = (field: keyof SettingsFlightSeatType, value: any) => {
    omikujiStore.updateComponentSettings('flightSeat', {
      ...flightSeat.value,
      [field]: value,
    })
  }

  // component 変更時に customLayout を新しいコンポーネントのデフォルト値でリセット
  const updateComponent = (key: FlightComponentKind) => {
    const defaultVal = flightComponentDefaults[key]
    omikujiStore.updateComponentSettings('flightSeat', {
      ...flightSeat.value,
      component: key,
      customLayout: typeof defaultVal === 'string' ? defaultVal : undefined,
    })
  }

  const resetField = (field: keyof SettingsFlightSeatType) => {
    updateField(field, SettingsFlightSchema.parse({})[field])
  }

  const statKeyLabelMap: Record<StatKeyNum, string> = {
    userName: 'ユーザー名',
    tc: 'チャット数',
    giftPrice: 'ギフト金額',
  }

  const currentPresets = computed(() => {
    return presets[flightSeat.value.component] ?? null
  })
</script>
