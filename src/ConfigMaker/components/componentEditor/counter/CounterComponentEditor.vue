<!-- src\ConfigMaker\components\componentEditor\counter\CounterComponentEditor.vue -->
<template>
  <div class="card bg-base-100 p-4 flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <!-- ランダム選択ボタン（新カラー設定時のみ表示） -->
      <RandomThemeButton v-if="isPro" @randomize="(newValue) => updateCounterField('color', newValue)" />
    </div>

    <!-- プレビュー -->
    <CounterPreviewCard
      v-if="counter.ruleKey"
      :counterSetting="counter"
      :count="counter.firstValue"
      :users="generateDummyUserNames(counter.maxUsers)"
    />

    <NoParamsCard v-else :message="'対象ルールIDを設定してください'" />

    <!-- テーマカラー -->
    <DaisyUiThemeEditor
      :model-value="counter.color"
      @update:model-value="(newValue) => updateCounterField('color', newValue)"
    />

    <!-- 設定項目 -->
    <SettingItem
      label="対象ルールキー"
      description="どのルールを対象にするか"
      :showReset="true"
      @reset="resetMap.ruleKey"
    >
      <select
        class="select select-bordered w-full"
        :value="counter.ruleKey || ''"
        @change="(e) => updateCounterField('ruleKey', (e.target as HTMLSelectElement).value || null)"
      >
        <option value="">未選択</option>
        <option v-for="(value, key) in rulesComment" :key="key" :value="key">
          {{ value.name }}
        </option>
      </select>
    </SettingItem>

    <!-- カウンターの対象 -->
    <SettingItem
      label="対象カウント種別"
      description="カウンターの対象を選択します"
      :showReset="true"
      @reset="resetMap.target"
    >
      <select
        class="select select-bordered w-full"
        :value="counter.target"
        @change="(e) => updateCounterField('target', (e.target as HTMLSelectElement).value)"
      >
        <option value="draw">実行回数</option>
        <option value="user">ユーザー数</option>
      </select>
    </SettingItem>

    <!-- ラベル名 -->
    <SettingItem label="ラベル" description="カウンターのラベルを設定します" :showReset="true" @reset="resetMap.label">
      <input
        type="text"
        class="input input-bordered w-full"
        :value="counter.label"
        @input="(e) => updateCounterField('label', (e.target as HTMLInputElement).value)"
      />
    </SettingItem>

    <!-- カウンターを表示するか -->
    <SettingItem
      label="カウンター表示"
      description="カウンターの表示・非表示を選択します"
      :showReset="true"
      @reset="resetMap.showCounter"
    >
      <label class="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          :checked="counter.showCounter"
          @change="(e) => updateCounterField('showCounter', (e.target as HTMLInputElement).checked)"
        />
        <span class="label-text">
          {{ counter.showCounter ? '表示する' : '表示しない' }}
        </span>
      </label>
    </SettingItem>

    <!-- 初期値 -->
    <SettingItem
      label="初期値"
      description="カウンターの開始値を設定します"
      :showReset="true"
      @reset="resetMap.firstValue"
    >
      <input
        type="number"
        min="0"
        class="input input-bordered w-24"
        :value="counter.firstValue"
        @input="(e) => updateCounterField('firstValue', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>

    <!-- カウントアップ/ダウン -->
    <SettingItem
      label="カウント方向"
      description="カウントアップかカウントダウンかを選択します"
      :showReset="true"
      @reset="resetMap.isDirectionUp"
    >
      <label class="label cursor-pointer justify-start gap-3">
        <input
          type="checkbox"
          class="toggle toggle-primary"
          :checked="counter.isDirectionUp"
          @change="(e) => updateCounterField('isDirectionUp', (e.target as HTMLInputElement).checked)"
        />
        <span class="label-text">
          {{ counter.isDirectionUp ? 'カウントアップ' : 'カウントダウン' }}
        </span>
      </label>
    </SettingItem>

    <!-- ユーザーリスト表示数 -->
    <SettingItem
      label="リスト表示数"
      description="カウンターに表示するユーザーの数を設定します(最大300)"
      :showReset="true"
      @reset="resetMap.maxUsers"
    >
      <input
        type="number"
        class="input input-bordered w-24"
        :value="counter.maxUsers"
        min="0"
        max="300"
        @input="(e) => updateCounterField('maxUsers', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsCounterSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import RandomThemeButton from '@/ConfigMaker/components/characters/color/RandomThemeButton.vue'
  import DaisyUiThemeEditor from '@/ConfigMaker/components/characters/color/DaisyUiThemeEditor.vue'
  import CounterPreviewCard from '@/MainGenerator/components/CounterPreview/CounterPreviewCard.vue'
  import { generateDummyUserNames } from '@/MainGenerator/components/GameRankingViewer/useDummyBotMessages'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isPro, isGod } = useSettingMode()

  const rulesComment = computed(() => data.value.comments)

  const counter = computed(() => data.value.displaySettings.components.counter)

  // 更新関数
  const updateCounterField = (field: keyof typeof counter.value, value: any) => {
    omikujiStore.updateNestedComponents('counter', {
      ...counter.value,
      [field]: value,
    })
  }

  // リセット関数
  const resetField = (field: keyof typeof counter.value) => {
    const defaults = SettingsCounterSchema.parse({})
    updateCounterField(field, defaults[field])
  }

  const resetMap = {
    ruleKey: () => resetField('ruleKey'),
    target: () => resetField('target'),
    label: () => resetField('label'),
    showCounter: () => resetField('showCounter'),
    firstValue: () => resetField('firstValue'),
    isDirectionUp: () => resetField('isDirectionUp'),
    maxUsers: () => resetField('maxUsers'),
    color: () => resetField('color'),
  }
</script>
