<!-- src\ConfigMaker\components\displaySettings\components\CounterComponentEditor.vue -->
<template>
  <div class="card bg-base-100 p-4 flex flex-col gap-4">
    <!-- プレビュー -->
    <div class="border p-2 rounded">
      <h3 v-if="counter.showLabel" class="text-lg font-bold mb-2">{{ counter.label }}</h3>
      <p>
        {{ counter.isDirectionUp ? 'カウントアップ' : 'カウントダウン' }}開始値:
        {{ counter.firstValue }}
      </p>
    </div>

    <!-- 設定項目 -->
    <SettingItem
      label="対象ルールキー"
      description="どのルールを対象にするか"
      :showReset="true"
      @reset="resetMap.ruleKey"
    >
      <input
        type="text"
        class="input input-bordered w-full"
        :value="counter.ruleKey || ''"
        @input="(e) => updateCounterField('ruleKey', (e.target as HTMLInputElement).value || null)"
      />
    </SettingItem>

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
        <option value="runCount">実行回数</option>
        <option value="userCount">ユーザー数</option>
        <option value="userName">ユーザー名</option>
      </select>
    </SettingItem>

    <SettingItem label="ラベル" description="カウンターのラベルを設定します" :showReset="true" @reset="resetMap.label">
      <input
        type="text"
        class="input input-bordered w-full"
        :value="counter.label"
        @input="(e) => updateCounterField('label', (e.target as HTMLInputElement).value)"
      />
    </SettingItem>

    <SettingItem
      label="初期値"
      description="カウンターの開始値を設定します"
      :showReset="true"
      @reset="resetMap.firstValue"
    >
      <input
        type="number"
        class="input input-bordered w-24"
        :value="counter.firstValue"
        @input="(e) => updateCounterField('firstValue', Number((e.target as HTMLInputElement).value))"
      />
    </SettingItem>

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

    <SettingItem
      label="カラー"
      description="カウンターのテーマカラーを選択します"
      :showReset="true"
      @reset="resetMap.color"
    >
      <select
        class="select select-bordered"
        :value="counter.color"
        @change="(e) => updateCounterField('color', (e.target as HTMLSelectElement).value)"
      >
        <option v-for="theme in themes" :key="theme" :value="theme">
          {{ theme }}
        </option>
      </select>
    </SettingItem>

    <SettingItem
      label="ラベル表示"
      description="ラベルを表示するかどうか"
      :showReset="true"
      @reset="resetMap.showLabel"
    >
      <input
        type="checkbox"
        class="toggle toggle-primary"
        :checked="counter.showLabel"
        @change="(e) => updateCounterField('showLabel', (e.target as HTMLInputElement).checked)"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { SettingsCounterSchema } from '@/types/OmikujiData/DisplaySettingsSchema'
  import { themes } from '@shared/styles/DaisyUiTheme'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const counter = computed(() => data.value.displaySettings.components.counter)

  // 更新関数
  const updateCounterField = (field: keyof typeof counter.value, value: any) => {
    omikujiStore.updateNestedDisplaySettings('components', {
      counter: {
        ...counter.value,
        [field]: value,
      },
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
    firstValue: () => resetField('firstValue'),
    isDirectionUp: () => resetField('isDirectionUp'),
    color: () => resetField('color'),
    showLabel: () => resetField('showLabel'),
  }
</script>
