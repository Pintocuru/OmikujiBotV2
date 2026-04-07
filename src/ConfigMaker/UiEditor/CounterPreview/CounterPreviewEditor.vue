<!-- src/ConfigMaker/UiEditor/CounterPreview/CounterPreviewEditor.vue -->
<template>
  <!-- プレビュー -->
  <CounterPreviewPreview />

  <!-- テーマカラー -->
  <DaisyUiThemeEditor :model-value="counter.color" @update:model-value="(newValue) => updateField('color', newValue)" />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="counter.component"
    :options="counterComponentMap"
    @update:modelValue="(val) => updateField('component', val)"
  />

  <!-- 設定項目 -->
  <SettingItem v-if="isComment" label="対象イベントキー" description="どのイベントを対象にするか">
    <div class="flex flex-wrap gap-2">
      <!-- すべて -->
      <div
        class="badge cursor-pointer"
        :class="counter.targetEventKey === '' ? 'badge-primary' : 'badge-outline'"
        @click="updateField('targetEventKey', '')"
      >
        すべて
      </div>
      <!-- 通常のイベント -->
      <div
        v-for="(value, key) in rulesComment"
        :key="key"
        class="badge cursor-pointer"
        :class="counter.targetEventKey === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('targetEventKey', key)"
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
          @click="updateField('target', 'draw')"
        >
          実行回数
        </div>
        <div
          class="badge cursor-pointer"
          :class="counter.target === 'user' ? 'badge-primary' : 'badge-outline'"
          @click="updateField('target', 'user')"
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
        @input="(e) => updateField('label', (e.target as HTMLInputElement).value)"
      />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { counterComponentMap, CounterPreviewSchema } from '@/types/'
  import CounterPreviewPreview from './CounterPreviewPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import DaisyUiThemeEditor from '@config/components/common/ThemeColorPicker/DaisyUiThemeEditor.vue'
  import { useSettingMode, useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import DisplayStyleSelector from '../CommonStyle/DisplayStyleSelector.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const { isComment } = useVisibilityAccess()

  const rulesComment = computed(() => data.value.comments)

  const counter = computed(() => data.value.components.settings.counter ?? CounterPreviewSchema.parse({}))

  // 更新関数
  const updateField = (field: keyof typeof counter.value, value: any) => {
    omikujiStore.updateComponentSettings('counter', {
      ...counter.value,
      [field]: value,
    })
  }

  // リセット関数
  const resetField = (field: keyof typeof counter.value) => {
    const defaults = CounterPreviewSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    ruleKey: () => resetField('targetEventKey'),
    component: () => resetField('component'),
    target: () => resetField('target'),
    label: () => resetField('label'),
    color: () => resetField('color'),
  }
</script>
