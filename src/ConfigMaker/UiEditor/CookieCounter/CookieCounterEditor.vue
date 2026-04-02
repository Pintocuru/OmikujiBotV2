<template>
  <CookieCounterPreview :cookieCounter="cookieCounter" :event-labels="eventLabels" :variable-labels="variableInput" />

  <SettingItem v-if="isPro" label="表示スタイル" description="表示形式を選択" forceMode="pro">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(config, key) in cookieComponentMap"
        :key="key"
        class="badge cursor-pointer"
        :class="cookieCounter.component === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('component', key)"
      >
        {{ config.label }}
      </div>
    </div>
  </SettingItem>

  <DaisyUiThemeEditor
    v-if="isAdv && cookieComponentMap[cookieCounter.component].isColor"
    :model-value="cookieCounter.color"
    @update:model-value="(v) => updateField('color', v)"
  />

  <CounterSelectorPanel
    :counters="counters"
    :event-rules="eventRules"
    :max-counters="maxCounters"
    @add="pushCounter"
    @remove="removeCounter"
    @reset="(type) => updateCounters(counters.filter((c) => c.type !== type))"
    @reorder="updateCounters2"
  />
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue'
  import { storeToRefs } from 'pinia'
  import { cookieComponentMap, CookieCounterSchema, CookieCounterCountersSchema } from '@/types/'
  import type { CookieCounterType } from '@/types/'
  import CookieCounterPreview from './CookieCounterPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import DaisyUiThemeEditor from '@config/components/common/ThemeColorPicker/DaisyUiThemeEditor.vue'
  import CounterSelectorPanel, { CounterItem } from '../StreamCounter/CounterSelectorPanel.vue'

  const { data } = storeToRefs(useOmikujiStore())
  const omikujiStore = useOmikujiStore()
  const { isAdv, isPro } = useSettingMode()

  const variableInput = reactive({ target: '', label: '' })

  const cookieCounter = computed(() => data.value.components.settings.cookieCounter ?? CookieCounterSchema.parse({}))
  const counters = computed(() => cookieCounter.value.counters)
  const counterCount = computed(() => counters.value.length)
  const maxCounters = computed(() => cookieComponentMap[cookieCounter.value.component].maxCounters)

  // イベントルール（ラベルマップも兼用）
  const eventRules = computed(() =>
    Object.values(data.value.comments || {}).map((r) => ({
      key: r.key,
      name: r.name || r.key,
    }))
  )
  const eventLabels = computed<Record<string, string>>(() =>
    Object.fromEntries(eventRules.value.map((r) => [r.key, r.name]))
  )

  // ---- ストア更新 ----
  const updateField = (field: keyof CookieCounterType, value: unknown) => {
    omikujiStore.updateComponentSettings('cookieCounter', { ...cookieCounter.value, [field]: value })
  }
  const updateCounters = (next: typeof counters.value) => updateField('counters', next)

  const updateCounters2 = (next: CounterItem[]) => {
    updateField('counters', next)
  }

  // ---- カウンター操作 ----

  const removeCounter = (id: string) => updateCounters(counters.value.filter((c) => c.id !== id))

  const pushCounter = (payload: Parameters<typeof CookieCounterCountersSchema.parse>[0]) => {
    if (counterCount.value >= maxCounters.value) return
    try {
      updateCounters([...counters.value, CookieCounterCountersSchema.parse(payload)])
    } catch (e) {
      console.error('Failed to parse counter item:', e)
    }
  }
</script>
