<!-- src/ConfigMaker/UiEditor/StreamCounter/StreamCounterEditor.vue -->
<template>
  <!-- プレビュー -->
  <StreamCounterPreview
    :streamCounter="streamCounter"
    :event-labels="previewEventLabels"
    :variable-labels="previewVariableLabels"
  />

  <!-- コンポーネント選択 -->
  <SettingItem v-if="isPro" label="表示スタイル" description="表示形式を選択" forceMode="pro">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(style, key) in streamComponentMap"
        :key="key"
        class="badge cursor-pointer"
        :class="streamCounter.component === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('component', key)"
      >
        {{ style }}
      </div>
    </div>
  </SettingItem>

  <!-- テーマ -->
  <SettingItem v-if="isAdv" label="テーマ" description="カラーテーマを選択します" forceMode="adv">
    <select
      class="select select-bordered"
      :value="streamCounter.color"
      :disabled="!isAdv"
      @change="(e) => updateField('color', (e.target as HTMLSelectElement).value)"
    >
      <option v-for="theme in themes" :key="theme" :value="theme">
        {{ theme }}
      </option>
    </select>
  </SettingItem>

  <!-- ラベルスタイル -->
  <SettingItem label="ラベルスタイル" description="カウンターのラベル表示方法を選択">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in labelStyleMap"
        :key="key"
        class="badge cursor-pointer"
        :class="streamCounter.labelStyle === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('labelStyle', key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- カラーサイクル設定（分離コンポーネント） -->
  <ColorCycleEditor :colorCycle="streamCounter.colorCycle" @update:colorCycle="(v) => updateField('colorCycle', v)" />

  <CounterSelectorPanel
    :counters="counters"
    :event-rules="eventRules"
    :max-counters="maxCounters"
    @add="handleAdd"
    @remove="handleRemove"
    @reset="handleReset"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { StreamCounterSchema, StreamCounterVariablesSchema, labelStyleMap, streamComponentMap } from '@/types/'
  import type { StreamDefaultKey, StreamCounterType } from '@/types/'
  import StreamCounterPreview from './StreamCounterPreview.vue'
  import ColorCycleEditor from './ColorCycleEditor.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { themes } from '@shared/styles/DaisyUiTheme'
  import type { CounterItem } from './CounterSelectorPanel.vue'
  import CounterSelectorPanel from './CounterSelectorPanel.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv, isPro } = useSettingMode()

  const streamCounter = computed(() => data.value.components.settings.streamCounter ?? StreamCounterSchema.parse({}))

  const updateField = (field: keyof StreamCounterType, value: unknown) => {
    omikujiStore.updateComponentSettings('streamCounter', {
      ...streamCounter.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof StreamCounterType) => {
    updateField(field, StreamCounterSchema.parse({})[field])
  }

  // ---- CounterSelectorPanel 用に3フィールドを CounterItem[] に統合 ----
  const counters = computed<CounterItem[]>(() => [
    ...streamCounter.value.defaultCounters.map((target) => ({
      id: `default:${target}`,
      type: 'default' as const,
      target,
    })),
    ...streamCounter.value.eventCounters.map((target) => ({
      id: `event:${target}`,
      type: 'event' as const,
      target,
    })),
    ...streamCounter.value.variableCounters, // StreamCounterVariablesSchema[] がそのまま CounterItem と互換
  ])

  const maxCounters = 8

  // ---- イベントルール ----
  const eventRules = computed(() =>
    Object.values(data.value.comments).map((record) => ({
      key: record.key,
      name: record.name || record.key,
    }))
  )

  const previewEventLabels = computed<Record<string, string>>(() =>
    Object.fromEntries(eventRules.value.map((r) => [r.key, r.name]))
  )

  const previewVariableLabels = computed<Record<string, string>>(() =>
    Object.fromEntries(streamCounter.value.variableCounters.map((c) => [c.target, c.label]))
  )

  // ---- CounterSelectorPanel イベントハンドラ ----
  const handleAdd = (item: Omit<CounterItem, 'id'>) => {
    if (item.type === 'default') {
      updateField('defaultCounters', [...streamCounter.value.defaultCounters, item.target as StreamDefaultKey])
    } else if (item.type === 'event') {
      updateField('eventCounters', [...streamCounter.value.eventCounters, item.target])
    } else {
      // variable: スキーマの parse で id を生成
      const newItem = StreamCounterVariablesSchema.parse({
        target: item.target,
        label: item.label,
      })
      updateField('variableCounters', [...streamCounter.value.variableCounters, newItem])
    }
  }

  const handleRemove = (id: string) => {
    // variable は UUID なので prefix なし
    if (streamCounter.value.variableCounters.some((v) => v.id === id)) {
      updateField(
        'variableCounters',
        streamCounter.value.variableCounters.filter((v) => v.id !== id)
      )
      return
    }
    // default / event は `type:target` の固定ID から復元
    const [type, target] = id.split(':')
    if (type === 'default') {
      updateField(
        'defaultCounters',
        streamCounter.value.defaultCounters.filter((k) => k !== target)
      )
    } else if (type === 'event') {
      updateField(
        'eventCounters',
        streamCounter.value.eventCounters.filter((k) => k !== target)
      )
    }
  }

  const handleReset = (type: 'default' | 'event') => {
    if (type === 'default') resetField('defaultCounters')
    else resetField('eventCounters')
  }
</script>
