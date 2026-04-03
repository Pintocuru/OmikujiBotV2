<!-- src/ConfigMaker/UiEditor/common/CounterSelectorPanel.vue -->
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
  <SettingItem label="変数カウンター" description="変数プレースホルダー名とラベルを入力">
    <div class="flex flex-col gap-3">
      <div class="flex flex-wrap gap-2 items-end">
        <div class="form-control">
          <label class="label"><span class="label-text-alt">変数名</span></label>
          <input
            v-model="variableInput.target"
            type="text"
            placeholder="point など"
            class="input input-bordered input-sm w-32"
          />
        </div>
        <div class="form-control">
          <label class="label"><span class="label-text-alt">表示名</span></label>
          <input
            v-model="variableInput.label"
            type="text"
            placeholder="ポイント"
            class="input input-bordered input-sm w-32"
          />
        </div>
        <button
          class="btn btn-sm btn-primary"
          :disabled="!variableInput.target || !variableInput.label || counterCount >= maxCounters"
          @click="addVariable"
        >
          追加
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        <div
          v-for="c in variableItems"
          :key="c.id"
          class="badge badge-accent gap-2 cursor-pointer"
          @click="emit('remove', c.id)"
        >
          <X class="w-4 h-4" />
          {{ c.label }} ({{ c.target }})
        </div>
      </div>
    </div>
  </SettingItem>

  <!-- 選択中の順番確認 -->
  <div v-if="counters.length > 0" class="mt-4 p-4 bg-base-200 rounded-box text-sm">
    <div class="font-bold mb-2">表示順（最大 {{ maxCounters }} 個）: 現在 {{ counterCount }}個</div>
    <div class="flex flex-wrap gap-1">
      <VueDraggable v-model="draggableCounters" :animation="150" handle=".drag-handle" class="flex flex-wrap gap-1">
        <div
          v-for="(c, i) in draggableCounters"
          :key="c.id"
          class="badge badge-primary gap-1 drag-handle cursor-grab active:cursor-grabbing"
        >
          <span class="opacity-50 text-xs">{{ i + 1 }}</span>
          {{ getLabel(c) }}
          <button class="btn btn-ghost btn-xs px-0 min-h-0 h-auto" @click.stop="emit('remove', c.id)">×</button>
        </div>
      </VueDraggable>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { reactive, computed } from 'vue'
  import { X } from 'lucide-vue-next'
  import { streamDefaultMap } from '@/types/'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { VueDraggable } from 'vue-draggable-plus'

  // 共通の Counter 型（CookieCounter の counters と互換）
  export interface CounterItem {
    id: string
    type: 'default' | 'event' | 'variable'
    target: string
    label?: string
  }

  interface EventRule {
    key: string
    name: string
  }

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
  }>()

  const variableInput = reactive({ target: '', label: '' })

  const counterCount = computed(() => props.counters.length)
  const variableItems = computed(() => props.counters.filter((c) => c.type === 'variable'))

  const draggableCounters = computed({
    get: () => [...props.counters], // コピーを返してpropsの直接mutateを防ぐ
    set: (v) => emit('reorder', v),
  })

  const isSelected = (type: CounterItem['type'], target: string) =>
    props.counters.some((c) => c.type === type && c.target === target)

  const isDisabled = (type: CounterItem['type'], target: string) =>
    !isSelected(type, target) && counterCount.value >= props.maxCounters

  // TODO:表示がIDになっているので修正
  const getLabel = (c: CounterItem) => {
    if (c.type === 'default') {
      return streamDefaultMap[c.target as keyof typeof streamDefaultMap] ?? c.target
    }

    // label があればそれを使う、なければ eventRules から探す、最後は target
    if (c.label) return c.label

    if (c.type === 'event') {
      const rule = props.eventRules.find((r) => r.key === c.target)
      return rule?.name || c.target
    }

    return c.target
  }

  const toggleDefault = (target: string, label: string) => {
    if (isSelected('default', target)) {
      const found = props.counters.find((c) => c.type === 'default' && c.target === target)
      if (found) emit('remove', found.id)
    } else {
      emit('add', { type: 'default', target, label })
    }
  }

  const toggleEvent = (target: string, label: string) => {
    if (isSelected('event', target)) {
      const found = props.counters.find((c) => c.type === 'event' && c.target === target)
      if (found) emit('remove', found.id)
    } else {
      emit('add', { type: 'event', target, label })
    }
  }

  const addVariable = () => {
    if (!variableInput.target || !variableInput.label || counterCount.value >= props.maxCounters) return
    emit('add', { type: 'variable', target: variableInput.target, label: variableInput.label })
    variableInput.target = ''
    variableInput.label = ''
  }
</script>
