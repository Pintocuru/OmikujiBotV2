<!-- src/ConfigMaker/UiEditor/StreamCounter/CounterSelector/CounterSelectorPanel.vue -->
<template>
  <!-- 標準カウンター -->
  <SettingItem
    label="標準カウンター"
    description="表示したい項目を選択してください"
    :showReset="true"
    @reset="emit('reset', 'default')"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in streamDefaultMap"
        :key="key"
        class="badge cursor-pointer"
        :class="isSelected('default', key) ? 'badge-primary' : 'badge-outline'"
        @click="toggleDefault(key, label)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- カスタムイベント -->
  <SettingItem
    v-if="eventRules.length > 0"
    label="カスタムイベント"
    description="設定済みのコメント演出をカウントします"
    :showReset="true"
    @reset="emit('reset', 'event')"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="rule in eventRules"
        :key="rule.key"
        class="badge cursor-pointer"
        :class="[
          isSelected('event', rule.key) ? 'badge-secondary' : 'badge-outline',
          isDisabled('event', rule.key) ? 'opacity-40 cursor-not-allowed' : '',
        ]"
        @click="toggleEvent(rule.key, rule.name)"
      >
        {{ rule.name }}
      </div>
    </div>
    <div class="text-xs text-base-content/50 mt-1">
      合計 {{ counterCount }}/{{ maxCounters }} 件
      <span v-if="counterCount >= maxCounters"> これ以上表示できません</span>
    </div>
  </SettingItem>

  <!-- 変数カウンター -->
  <CounterVariableSection
    :counters="counters"
    :addDisabled="counterCount >= maxCounters"
    @add="emit('add', $event)"
    @remove="emit('remove', $event)"
    @update="emit('update', $event)"
  />

  <!-- 表示順 -->
  <CounterOrderSection
    :counters="counters"
    :eventRules="eventRules"
    :maxCounters="maxCounters"
    @remove="emit('remove', $event)"
    @reorder="emit('reorder', $event)"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { streamDefaultMap } from '@/types'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import CounterVariableSection from './CounterVariableSection.vue'
  import CounterOrderSection from './CounterOrderSection.vue'
  import type { CounterItem, EventRule } from './counterTypes'

  const props = defineProps<{
    counters: CounterItem[]
    eventRules: EventRule[]
    maxCounters: number
  }>()

  const emit = defineEmits<{
    (e: 'add', item: Omit<CounterItem, 'id'>): void
    (e: 'remove', id: string): void
    (e: 'reset', type: 'default' | 'event'): void
    (e: 'reorder', items: CounterItem[]): void
    (e: 'update', payload: { id: string; patch: { target: string; label: string } }): void
  }>()

  const counterCount = computed(() => props.counters.length)

  const isSelected = (type: CounterItem['type'], target: string) =>
    props.counters.some((c) => c.type === type && c.target === target)

  const isDisabled = (type: CounterItem['type'], target: string) =>
    !isSelected(type, target) && counterCount.value >= props.maxCounters

  const toggleDefault = (target: string, label: string) => {
    const found = props.counters.find((c) => c.type === 'default' && c.target === target)
    if (found) {
      emit('remove', found.id)
    } else if (!isDisabled('default', target)) {
      emit('add', { type: 'default', target, label })
    }
  }

  const toggleEvent = (target: string, label: string) => {
    const found = props.counters.find((c) => c.type === 'event' && c.target === target)
    if (found) {
      emit('remove', found.id)
    } else if (!isDisabled('event', target)) {
      emit('add', { type: 'event', target, label })
    }
  }
</script>
