<!-- src/ConfigMaker/components/UiEditor/LiverCounter/LiverCounterEditor.vue -->
<template>
  <!-- プレビュー -->
  <LiverCounterPreview :liver-counter="liverCounter" :event-labels="previewEventLabels" />

  <!-- コンポーネント選択 -->
  <SettingItem v-if="isPro" label="表示スタイル" description="表示形式を選択" forceMode="pro">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(style, key) in liverComponentMap"
        :key="key"
        class="badge cursor-pointer"
        :class="liverCounter.component === key ? 'badge-primary' : 'badge-outline'"
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
      :value="liverCounter.color"
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
        :class="liverCounter.labelStyle === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('labelStyle', key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- カラーサイクル設定（分離コンポーネント） -->
  <ColorCycleEditor :colorCycle="liverCounter.colorCycle" @update:colorCycle="(v) => updateField('colorCycle', v)" />

  <!-- デフォルトカウンター選択 -->
  <SettingItem
    label="表示するカウンター"
    description="クリックした順番に並びます"
    :showReset="true"
    @reset="resetMap.defaultCounters"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in liverDefaultMap"
        :key="key"
        class="badge cursor-pointer"
        :class="liverCounter.defaultCounters.includes(key) ? 'badge-primary' : 'badge-outline'"
        @click="toggleDefaultCounter(key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- イベントカウンター選択 -->
  <SettingItem
    v-if="availableEventRules.length !== 0"
    label="イベントカウンター"
    description="クリックした順番に並びます"
    :showReset="true"
    @reset="resetMap.eventCounters"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="rule in availableEventRules"
        :key="rule.key"
        class="badge cursor-pointer"
        :class="[
          liverCounter.eventCounters.includes(rule.key) ? 'badge-secondary' : 'badge-outline',
          isEventCounterDisabled(rule.key) ? 'opacity-40 cursor-not-allowed' : '',
        ]"
        @click="toggleEventCounter(rule.key)"
      >
        {{ rule.name }}
      </div>
    </div>
    <div class="text-xs text-base-content/50 mt-1">
      合計 {{ totalCounterCount }}/8 件
      <span v-if="totalCounterCount >= 8"> これ以上表示できません</span>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsLiverSchema, labelStyleMap, liverComponentMap, liverDefaultMap } from '@/types/'
  import type { LiverDefaultKey, SettingsLiverCounterType } from '@/types/'
  import LiverCounterPreview from './LiverCounterPreview.vue'
  import ColorCycleEditor from './ColorCycleEditor.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { themes } from '@shared/styles/DaisyUiTheme'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv, isPro } = useSettingMode()

  const liverCounter = computed(() => data.value.components.settings.liverCounter ?? SettingsLiverSchema.parse({}))

  // ---- Field Update ----
  const updateField = (field: keyof SettingsLiverCounterType, value: unknown) => {
    omikujiStore.updateComponentSettings('liverCounter', {
      ...liverCounter.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof SettingsLiverCounterType) => {
    const defaults = SettingsLiverSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    defaultCounters: () => resetField('defaultCounters'),
    eventCounters: () => resetField('eventCounters'),
    labelStyle: () => resetField('labelStyle'),
  }

  // ---- defaultCounters トグル ----
  const toggleDefaultCounter = (key: LiverDefaultKey) => {
    const current = liverCounter.value.defaultCounters
    const isSelected = current.includes(key)
    if (isSelected) {
      updateField(
        'defaultCounters',
        current.filter((k) => k !== key)
      )
    } else {
      if (totalCounterCount.value >= 8) return
      updateField('defaultCounters', [...current, key])
    }
  }

  // ---- eventCounters ----
  const availableEventRules = computed(() => {
    return Object.values(data.value.comments).map((record) => ({
      key: record.key,
      name: record.name || record.key,
    }))
  })

  const totalCounterCount = computed(
    () => liverCounter.value.defaultCounters.length + liverCounter.value.eventCounters.length
  )

  const isEventCounterDisabled = (key: string) => {
    return !liverCounter.value.eventCounters.includes(key) && totalCounterCount.value >= 8
  }

  const toggleEventCounter = (key: string) => {
    const current = liverCounter.value.eventCounters
    const isSelected = current.includes(key)
    if (isSelected) {
      updateField(
        'eventCounters',
        current.filter((k) => k !== key)
      )
    } else {
      if (totalCounterCount.value >= 8) return
      updateField('eventCounters', [...current, key])
    }
  }

  const previewEventLabels = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {}
    for (const rule of availableEventRules.value) {
      result[rule.key] = rule.name
    }
    return result
  })
</script>
