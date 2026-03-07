<!-- src/ConfigMaker/components/UiEditor/FlightSeat/FlightSeatEditor.vue -->
<template>
  <!-- プレビュー -->
  <FlightSeatPreview />

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
  <SettingItem v-if="isPro" label="座席配置" description="座席の並び方を選択します" forceMode="pro">
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

  <!-- square の場合: 縦×横 -->
  <div v-if="flightSeat.layout === 'square' && isAdv" class="grid grid-cols-1 sm:grid-cols-2 gap-2">
    <SettingItem
      label="縦（行数）"
      description="縦方向の座席数"
      :showReset="true"
      @reset="resetMap.rows"
      forceMode="adv"
    >
      <input
        type="number"
        min="1"
        max="30"
        class="input input-bordered w-24"
        :value="flightSeat.rows"
        @input="(e) => updateField('rows', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>

    <SettingItem
      label="横（列数）"
      description="横方向の座席数"
      :showReset="true"
      @reset="resetMap.cols"
      forceMode="adv"
    >
      <input
        type="number"
        min="1"
        max="40"
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
    description="円周上に配置する座席数"
    :showReset="true"
    @reset="resetMap.circleSeats"
  >
    <input
      type="number"
      min="5"
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

  <!-- 対象イベントキー -->
  <SettingItem
    v-if="isComment"
    label="対象イベントキー"
    description="対象とするイベントを指定します"
    :showReset="true"
    @reset="resetMap.targetEventKey"
  >
    <div class="flex flex-wrap gap-2">
      <!-- すべて -->
      <div
        class="badge cursor-pointer"
        :class="flightSeat.targetEventKey === '' ? 'badge-primary' : 'badge-outline'"
        @click="updateField('targetEventKey', '')"
      >
        すべて
      </div>
      <!-- 通常のイベント -->
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

  <!-- 満席時のランダム置き換え -->
  <SettingItem
    label="満席時のランダム置き換え"
    description="満席時、ランダムなユーザーを降ろします"
    :showReset="true"
    @reset="resetMap.isRandomReplacement"
  >
    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-4">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          :checked="flightSeat.isRandomReplacement"
          @change="(e) => updateField('isRandomReplacement', (e.target as HTMLInputElement).checked)"
        />
        <span class="label-text">{{
          flightSeat.isRandomReplacement ? '有効（誰かを降ろして着席）' : '無効（満席なら無視）'
        }}</span>
      </label>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { flightSeatLayoutMap, SettingsFlightSeatSchema, StatKeyNum } from '@/types/'
  import FlightSeatPreview from './FlightSeatPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import CustomLayoutEditor from './CustomLayoutEditor.vue'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import { useSettingMode, useVisibilityAccess } from '@/ConfigMaker/scripts/useAccessCheckerConfig'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const flightSeat = computed(() => data.value.components.settings.flightSeat ?? SettingsFlightSeatSchema.parse({}))
  const rulesComment = computed(() => data.value.comments)

  const { isAdv, isPro } = useSettingMode()
  const { isComment } = useVisibilityAccess()

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
    targetEventKey: () => resetField('targetEventKey'),
    isRandomReplacement: () => resetField('isRandomReplacement'),
  }

  const statKeyLabelMap: Record<StatKeyNum, string> = {
    userName: 'ユーザー名',
    tc: 'チャット数',
    // score: 'スコア(未実装)',
    giftPrice: 'ギフト金額',
  }
</script>
