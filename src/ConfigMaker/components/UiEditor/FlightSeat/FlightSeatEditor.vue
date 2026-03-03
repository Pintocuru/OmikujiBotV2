<!-- src/ConfigMaker/components/UiEditor/FlightSeat/FlightSeatEditor.vue -->
<template>
  <NoParamsCard v-if="!isComment" :message="'コメント機能を有効にしてください'" />

  <!-- プレビュー -->
  <div class="max-h-56 overflow-y-hidden" :class="[fontFamily]" :data-theme="flightSeat.color">
    <SeatGrid
      :seats="previewSeats"
      :layout="flightSeat.layout"
      :rows="flightSeat.rows"
      :cols="flightSeat.cols"
      :customLayout="parsedCustomLayout"
      :circleSeats="flightSeat.circleSeats"
    />
  </div>

  <!-- 座席数の表示 -->
  <InformationCard variant="neutral">
    <p class="text-base">
      現在の総座席数: <span class="label bg-primary text-primary-content">{{ totalSeats }}</span>
    </p>
  </InformationCard>

  <!-- タイトル -->
  <SettingItem label="タイトル" description="座席表のタイトルを設定します" :showReset="true" @reset="resetMap.label">
    <input
      type="text"
      class="input input-bordered w-full"
      :value="flightSeat.label"
      @input="(e) => updateField('label', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <!-- 座席配置パターン -->
  <SettingItem label="座席配置" description="座席の並び方を選択します">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in flightSeatLayoutMap"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="flightSeat.layout === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('layout', key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- テーマカラー -->
  <SettingItem label="テーマカラー" description="座席表のテーマカラーを選択">
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

  <!-- square の場合: 縦×横 -->
  <div v-if="flightSeat.layout === 'square'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SettingItem label="縦（行数）" description="縦方向の座席数（1〜10）" :showReset="true" @reset="resetMap.rows">
      <input
        type="number"
        min="1"
        max="10"
        class="input input-bordered w-24"
        :value="flightSeat.rows"
        @input="(e) => updateField('rows', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>

    <SettingItem label="横（列数）" description="横方向の座席数（1〜15）" :showReset="true" @reset="resetMap.cols">
      <input
        type="number"
        min="1"
        max="15"
        class="input input-bordered w-24"
        :value="flightSeat.cols"
        @input="(e) => updateField('cols', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>
  </div>

  <!-- circle の場合: 外周の座席数 -->
  <SettingItem
    v-else-if="flightSeat.layout === 'circle'"
    label="外周の座席数"
    description="円周上に配置する座席数（3〜30）"
    :showReset="true"
    @reset="resetMap.circleSeats"
  >
    <input
      type="number"
      min="3"
      max="30"
      class="input input-bordered w-24"
      :value="flightSeat.circleSeats"
      @input="(e) => updateField('circleSeats', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>

  <!-- custom の場合: プリセット選択 & カスタム配列入力 -->
  <CustomLayoutEditor
    v-else-if="flightSeat.layout === 'custom'"
    :customLayoutString="flightSeat.customLayout ?? '[1,2,3,4,5]'"
    @update="(value) => updateField('customLayout', value)"
  />

  <!-- 再搭乗許可 -->
  <SettingItem
    label="再搭乗を許可"
    description="過去に座席に乗っていたユーザーでも、空席があれば再度座れるようにします"
    :showReset="true"
    @reset="resetMap.allowReseating"
  >
    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-4">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          :checked="flightSeat.allowReseating"
          @change="(e) => updateField('allowReseating', (e.target as HTMLInputElement).checked)"
        />
        <span class="label-text">{{ flightSeat.allowReseating ? '有効' : '無効' }}</span>
      </label>
    </div>
  </SettingItem>

  <!-- 履歴保存数 -->
  <SettingItem
    label="履歴保存数"
    description="満席リセット時の履歴を保存する回数（0〜20）"
    :showReset="true"
    @reset="resetMap.historyLimit"
  >
    <input
      type="number"
      min="0"
      max="20"
      class="input input-bordered w-24"
      :value="flightSeat.historyLimit"
      @input="(e) => updateField('historyLimit', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { flightSeatLayoutMap, SettingsFlightSeatSchema, useFontFamily } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import SeatGrid from '@main/ui/FlightSeat/parts/SeatGrid.vue'
  import { calculateTotalSeats } from '@main/ui/FlightSeat/seatLayoutUtils'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import CustomLayoutEditor from './CustomLayoutEditor.vue'
  import { layoutStringToArray } from './CustomLayoutPresets'
  import { themes } from '@shared/styles/DaisyUiTheme'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isComment } = useVisibilityAccess()
  const fontFamily = computed(() => useFontFamily(data.value.components.commonStyle.fontFamily ?? 'default'))

  const flightSeat = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSeatSchema.parse({}))

  // customLayoutを配列にパース
  const parsedCustomLayout = computed(() => {
    if (flightSeat.value.layout !== 'custom') return undefined
    return layoutStringToArray(flightSeat.value.customLayout ?? '[1,2,3,4,5]')
  })

  // 総座席数を計算
  const totalSeats = computed(() => {
    const { layout, rows, cols, circleSeats } = flightSeat.value
    return calculateTotalSeats(layout, rows, cols, parsedCustomLayout.value, circleSeats)
  })

  // プレビュー用の空席配列
  const previewSeats = computed(() => {
    return Array(totalSeats.value).fill(null)
  })

  const updateField = (field: keyof typeof flightSeat.value, value: any) => {
    omikujiStore.updateComponentSettings('flightSeat', {
      ...flightSeat.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof typeof flightSeat.value) => {
    const defaults = SettingsFlightSeatSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    label: () => resetField('label'),
    rows: () => resetField('rows'),
    cols: () => resetField('cols'),
    circleSeats: () => resetField('circleSeats'),
    historyLimit: () => resetField('historyLimit'),
    allowReseating: () => resetField('allowReseating'),
  }
</script>
