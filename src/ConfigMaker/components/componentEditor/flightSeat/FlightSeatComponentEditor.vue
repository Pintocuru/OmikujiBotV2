<!-- src\ConfigMaker\components\componentEditor\flightseat\FlightSeatComponentEditor.vue -->
<template>
  <NoParamsCard v-if="!isComment" :message="'コメント機能を有効にしてください'" />

  <!-- タイトル -->
  <SettingItem
    label="タイトル"
    description="座席表のタイトルを設定します"
    :showReset="true"
    @reset="resetMap.title"
  >
    <input
      type="text"
      class="input input-bordered w-full"
      :value="flightSeat.title"
      @input="(e) => updateField('title', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>

  <!-- 座席配置パターン -->
  <SettingItem label="座席配置" description="座席の並び方を選択します">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in flightSeatLayouts"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="flightSeat.layout === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('layout', key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- square の場合: 縦×横 -->
  <div v-if="flightSeat.layout === 'square'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <SettingItem
      label="縦（行数）"
      description="縦方向の座席数（1〜10）"
      :showReset="true"
      @reset="resetMap.rows"
    >
      <input
        type="number"
        min="1"
        max="10"
        class="input input-bordered w-24"
        :value="flightSeat.rows"
        @input="(e) => updateField('rows', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>

    <SettingItem
      label="横（列数）"
      description="横方向の座席数（1〜10）"
      :showReset="true"
      @reset="resetMap.cols"
    >
      <input
        type="number"
        min="1"
        max="10"
        class="input input-bordered w-24"
        :value="flightSeat.cols"
        @input="(e) => updateField('cols', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>
  </div>

  <!-- pyramid, inversePyramid, theater の場合: 高さのみ -->
  <SettingItem
    v-else
    label="高さ"
    description="ピラミッド・シアターの段数（1〜10）"
    :showReset="true"
    @reset="resetMap.rows"
  >
    <input
      type="number"
      min="1"
      max="10"
      class="input input-bordered w-24"
      :value="flightSeat.rows"
      @input="(e) => updateField('rows', Number((e.target as HTMLInputElement).value))"
    />
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

  <!-- 背景デザイン（オプション） -->
  <SettingItem 
    label="背景デザイン" 
    description="座席表の背景イメージ（オプション）"
    :forceMode="'pro'"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in flightSeatVehicles"
        :key="key"
        class="badge badge-lg cursor-pointer"
        :class="flightSeat.backgroundVehicle === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('backgroundVehicle', key)"
      >
        {{ label }}
      </div>
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

  <!-- 座席数の表示 -->
  <InformationCard variant="neutral">
    <p class="text-base">
      現在の総座席数: <span class="label bg-primary text-primary-content">{{ totalSeats }}</span>
    </p>
  </InformationCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { flightSeatLayouts, flightSeatVehicles, SettingsFlightSeatSchema } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isComment } = useVisibilityAccess()

  const flightSeat = computed(() => data.value.components.settings.flightSeat)

  // 総座席数を計算
  const totalSeats = computed(() => {
    const { layout, rows, cols,  } = flightSeat.value
    
    switch (layout) {
      case 'square':
        return rows * cols
      
      case 'pyramid':
        // 1 + 2 + 3 + ... + rows
        return (rows * (rows + 1)) / 2
      
      case 'inversePyramid':
        // rows + (rows-1) + ... + 1
        return (rows * (rows + 1)) / 2
      
      case 'theater':
        // 中央が最大、両端が最小のパターン
        // 簡易計算: rows * (rows / 2 + 2) 程度
        return Math.floor(rows * (rows / 2 + 2))
      
      default:
        return 0
    }
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
    title: () => resetField('title'),
    rows: () => resetField('rows'),
    cols: () => resetField('cols'),
    historyLimit: () => resetField('historyLimit'),
  }
</script>