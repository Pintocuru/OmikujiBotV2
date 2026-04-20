<!-- src/ConfigMaker/UiEditor/StreamCounter/StreamCounterEditor.vue -->
<template>
  <!-- プレビュー -->
  <StreamCounterPreview
    :streamCounter="streamCounter"
    :event-labels="previewEventLabels"
    :variable-labels="previewVariableLabels"
  />

  <!-- コンポーネント選択 -->
  <DisplayStyleSelector
    :modelValue="streamCounter.component"
    :options="streamComponentMap"
    @update:modelValue="(val) => updateField('component', val)"
  />

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
    @reorder="handleReorder"
    @update="handleUpdate"
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
  import CounterSelectorPanel from './CounterSelector/CounterSelectorPanel.vue'
  import DisplayStyleSelector from '../CommonStyle/DisplayStyleSelector.vue'
  import { CounterItem } from './CounterSelector/counterTypes'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv } = useSettingMode()

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
    // デフォルトのカウンター
    ...streamCounter.value.defaultCounters.map((target) => ({
      id: `default:${target}`,
      type: 'default' as const,
      target,
    })),
    // コメントイベントのカウンター
    ...streamCounter.value.eventCounters.map((target) => {
      const rule = eventRules.value.find((r) => r.key === target)
      return {
        id: `event:${target}`,
        type: 'event' as const,
        target,
        label: rule?.name || target, // ここで確実にラベルを特定する
      }
    }),
    // 変数カウンター
    ...streamCounter.value.variableCounters, // StreamCounterVariablesSchema[] がそのまま CounterItem と互換
  ])

  const maxCounters = 24

  // ---- イベントルール ----
  const eventRules = computed(() =>
    Object.values(data.value.comments).map((record) => ({
      key: record.key,
      name: record.name || record.key,
    }))
  )

  const handleReorder = (list: CounterItem[]) => {
    const defaultCounters: StreamDefaultKey[] = []
    const eventCounters: string[] = []
    const variableCounters: typeof streamCounter.value.variableCounters = []

    for (const item of list) {
      if (item.type === 'default') {
        defaultCounters.push(item.target as StreamDefaultKey)
      } else if (item.type === 'event') {
        eventCounters.push(item.target)
      } else {
        // id一致で元データ拾う
        const found = streamCounter.value.variableCounters.find((v) => v.id === item.id)
        if (found) variableCounters.push(found)
      }
    }

    updateField('defaultCounters', defaultCounters)
    updateField('eventCounters', eventCounters)
    updateField('variableCounters', variableCounters)
  }

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

  const handleUpdate = (payload: { id: string; patch: { target: string; label: string } }) => {
    updateField(
      'variableCounters',
      streamCounter.value.variableCounters.map((v) => (v.id === payload.id ? { ...v, ...payload.patch } : v))
    )
  }
</script>
