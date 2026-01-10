<!-- src\ConfigMaker\components\componentEditor\counter\CounterComponentEditor.vue -->
<template>
  <!-- プレビュー -->
  <CounterPreviewCard
    v-if="counter.ruleKey"
    :counterSetting="counter"
    :count="counter.firstValue"
    :users="generateDummyUserNames(counter.maxUsers)"
  />

  <NoParamsCard v-else :message="'対象ルールキーを設定してください'" />

  <!-- テーマカラー -->
  <DaisyUiThemeEditor
    :model-value="counter.color"
    @update:model-value="(newValue) => updateCounterField('color', newValue)"
  />

  <!-- 設定項目 -->
  <SettingItem
    label="対象ルールキー"
    description="どのルールを対象にするか"
    :variant="counter.ruleKey === '' || !counter.ruleKey ? 'warning' : undefined"
    :showWarning="counter.ruleKey === '' || !counter.ruleKey"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(value, key) in rulesComment"
        :key="key"
        class="badge cursor-pointer"
        :class="counter.ruleKey === key ? 'badge-primary' : 'badge-outline'"
        @click="updateCounterField('ruleKey', key)"
      >
        {{ value.name }}
      </div>
    </div>
  </SettingItem>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- カウンターの対象 -->
    <SettingItem label="対象カウント種別" description="カウンターの対象を選択">
      <div class="flex gap-2 flex-wrap">
        <div
          class="badge cursor-pointer"
          :class="counter.target === 'draw' ? 'badge-primary' : 'badge-outline'"
          @click="updateCounterField('target', 'draw')"
        >
          実行回数
        </div>
        <div
          class="badge cursor-pointer"
          :class="counter.target === 'user' ? 'badge-primary' : 'badge-outline'"
          @click="updateCounterField('target', 'user')"
        >
          ユーザー数
        </div>
      </div>
    </SettingItem>

    <!-- ラベル名 -->
    <SettingItem label="ラベル" description="カウンターのラベルを設定" :showReset="true" @reset="resetMap.label">
      <input
        type="text"
        class="input input-bordered w-full"
        :value="counter.label"
        @input="(e) => updateCounterField('label', (e.target as HTMLInputElement).value)"
      />
    </SettingItem>

    <!-- カウンターを表示するか -->
    <SettingItem label="カウンター表示" description="数値の表示・非表示を選択">
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
    <SettingItem label="初期値" description="カウンターの開始値を設定" :showReset="true" @reset="resetMap.firstValue">
      <input
        type="number"
        min="0"
        class="input input-bordered w-24"
        :value="counter.firstValue"
        @input="(e) => updateCounterField('firstValue', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>

    <!-- カウントアップ/ダウン -->
    <SettingItem label="カウント方向" description="アップ↑ か、ダウン↓ を選択">
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
      description="カウンターに表示するユーザーの数を設定(最大300)"
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
  import { SettingsCounterSchema } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import DaisyUiThemeEditor from '@config/components/common/ThemeColorPicker/DaisyUiThemeEditor.vue'
  import CounterPreviewCard from '@/common/ui/CounterPreview/CounterPreviewCard.vue'
  import { generateDummyUserNames } from '@/common/ui/GameRanking/useDummyBotMessages'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const rulesComment = computed(() => data.value.comments)

  const counter = computed(() => data.value.components.counter)

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
