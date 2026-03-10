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

  <!-- 座席配置パターン (component内) -->
  <SettingItem v-if="isPro" label="座席配置" description="座席の並び方を選択します" forceMode="pro">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in flightSeatLayoutMap"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="component.layout === key ? 'badge-primary' : 'badge-outline'"
        @click="updateComponent('layout', key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- square の場合: 縦×横 -->
  <div v-if="component.layout === 'square' && isAdv" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <SettingItem
      label="縦（行数）"
      description="縦方向の座席数"
      :showReset="true"
      @reset="resetComponent('rows')"
      forceMode="adv"
    >
      <input
        type="number"
        min="1"
        max="30"
        class="input input-bordered w-24"
        :value="component.rows"
        @input="(e) => updateComponent('rows', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>

    <SettingItem
      label="横（列数）"
      description="横方向の座席数"
      :showReset="true"
      @reset="resetComponent('cols')"
      forceMode="adv"
    >
      <input
        type="number"
        min="1"
        max="40"
        class="input input-bordered w-24"
        :value="component.cols"
        @input="(e) => updateComponent('cols', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>
  </div>

  <!-- circle の場合: 外周の座席数 -->
  <SettingItem
    v-else-if="component.layout === 'circle'"
    label="外周の座席数"
    description="円周上に配置する座席数"
    :showReset="true"
    @reset="resetComponent('circleSeats')"
  >
    <input
      type="number"
      min="5"
      max="30"
      class="input input-bordered w-24"
      :value="component.circleSeats"
      @input="(e) => updateComponent('circleSeats', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>

  <!-- custom の場合: プリセット選択 & カスタム配列入力 -->
  <CustomLayoutEditor
    v-else-if="component.layout === 'custom'"
    :customLayoutString="component.customLayout ?? '[1,2,3,4,5]'"
    @update="(value) => updateComponent('customLayout', value)"
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
    flightSeatLayoutMap,
    FlightSeatComponentConfig,
    FlightSeatComponentSchema,
    SettingsFlightSchema,
    SettingsFlightSeatType,
    StatKeyNum,
  } from '@/types/'
  import FlightSeatPreview from './FlightSeatPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import CustomLayoutEditor from './CustomLayoutEditor.vue'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import { useSettingMode, useVisibilityAccess } from '@/ConfigMaker/scripts/useAccessCheckerConfig'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const flightSeat = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSchema.parse({}))
  const component = computed(() => flightSeat.value.component)
  const rulesComment = computed(() => data.value.comments)

  const { isAdv, isPro } = useSettingMode()
  const { isComment } = useVisibilityAccess()

  /** トップレベルフィールドの更新 */
  const updateField = (field: keyof SettingsFlightSeatType, value: any) => {
    omikujiStore.updateComponentSettings('flightSeat', {
      ...flightSeat.value,
      [field]: value,
    })
  }

  /** component ネスト内フィールドの更新 */
  const updateComponent = (field: keyof FlightSeatComponentConfig, value: any) => {
    omikujiStore.updateComponentSettings('flightSeat', {
      ...flightSeat.value,
      component: { ...component.value, [field]: value },
    })
  }

  const resetField = (field: keyof SettingsFlightSeatType) => {
    updateField(field, SettingsFlightSchema.parse({})[field])
  }

  const resetComponent = (field: keyof FlightSeatComponentConfig) => {
    updateComponent(field, FlightSeatComponentSchema.parse({})[field])
  }

  const statKeyLabelMap: Record<StatKeyNum, string> = {
    userName: 'ユーザー名',
    tc: 'チャット数',
    giftPrice: 'ギフト金額',
  }
</script>
