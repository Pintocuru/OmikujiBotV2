<!-- src/ConfigMaker/components/UiEditor/FlightSeat/FlightSeatEditor.vue -->
<template>
  <!-- プレビュー -->
  <FlightSeatPreview />

  <!-- タイトル -->
  <SettingItem
    label="タイトル"
    description="座席表のタイトルを設定します"
    :showReset="true"
    @reset="resetField('label')"
  >
    <input
      type="text"
      class="input input-bordered w-full"
      :value="flightSeat.label"
      @input="(e) => updateField('label', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <!-- コンポーネント種別 -->
  <SettingItem label="レイアウト種別" description="座席の見た目を選択します">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in flightComponentMap"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="component.kind === key ? 'badge-primary' : 'badge-outline'"
        @click="selectKind(key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

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
  <SettingItem v-if="isAdv" label="テーマカラー" description="座席表のテーマカラーを選択" forceMode="adv">
    <select
      class="select select-bordered"
      :value="flightSeat.color"
      @change="(e) => updateField('color', (e.target as HTMLSelectElement).value)"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
  </SettingItem>

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
    FlightComponentKind,
    FlightSeatComponentSchema,
    flightComponentDefaults,
    SettingsFlightSchema,
    SettingsFlightSeatType,
    StatKeyNum,
  } from '@/types/'
  import FlightSeatPreview from './FlightSeatPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import { useSettingMode, useVisibilityAccess } from '@/ConfigMaker/scripts/useAccessCheckerConfig'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const flightSeat = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSchema.parse({}))
  const component = computed(() => flightSeat.value.component)
  const rulesComment = computed(() => data.value.comments)

  const { isAdv } = useSettingMode()
  const { isComment } = useVisibilityAccess()

  /** トップレベルフィールドの更新 */
  const updateField = (field: keyof SettingsFlightSeatType, value: any) => {
    omikujiStore.updateComponentSettings('flightSeat', {
      ...flightSeat.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof SettingsFlightSeatType) => {
    updateField(field, SettingsFlightSchema.parse({})[field])
  }

  /** kind 変更時: kind に応じたデフォルト値を component にマージして適用 */
  const selectKind = (kind: FlightComponentKind) => {
    const base = FlightSeatComponentSchema.parse({})
    const defaults = flightComponentDefaults[kind]
    omikujiStore.updateComponentSettings('flightSeat', {
      ...flightSeat.value,
      component: { ...base, ...defaults, kind },
    })
  }

  const statKeyLabelMap: Record<StatKeyNum, string> = {
    userName: 'ユーザー名',
    tc: 'チャット数',
    giftPrice: 'ギフト金額',
  }
</script>
