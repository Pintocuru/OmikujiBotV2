<!-- src\ConfigMaker\components\componentEditor\counter\CounterComponentEditor.vue -->
<template>
  <!-- プレビュー -->
  <div v-if="counter.ruleKey" class="max-h-64 overflow-y-hidden">
    <CounterPreviewCard
      :counterSetting="counter"
      :count="0"
      :users="generateDummyUserNames(counter.limitUserCount ? counter.limitUserCount : 100)"
    />
  </div>

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
        {{ value.name || '名称未設定' }}
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

    <!-- ユーザーリスト表示数 -->
    <SettingItem
      label="リスト表示数"
      description="カウンターに表示するユーザーの数を設定"
      :showReset="true"
      @reset="resetMap.limitUserCount"
    >
      <div class="flex items-center gap-3">
        <!-- チェックボックス：制限を有効化 -->
        <label v-if="counter.limitUserCount === null" class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            class="checkbox"
            :checked="counter.limitUserCount !== null"
            @change="
              (e) => {
                const checked = (e.target as HTMLInputElement).checked
                updateCounterField('limitUserCount', checked ? 0 : null)
              }
            "
          />
          <span>制限する</span>
        </label>

        <!-- 数値入力：チェックONのときだけ有効 -->
        <input
          v-else
          type="number"
          class="input input-bordered w-24"
          :disabled="counter.limitUserCount === null"
          :value="counter.limitUserCount ?? ''"
          min="0"
          max="300"
          @input="(e) => updateCounterField('limitUserCount', Number((e.target as HTMLInputElement).value))"
        />
      </div>
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
    limitUserCount: () => resetField('limitUserCount'),
    color: () => resetField('color'),
  }
</script>
