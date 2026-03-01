<!-- src/ConfigMaker/components/componentEditor/LiverCounter/LiverCounterEditor.vue -->
<template>
  <!-- プレビュー -->
  <div class="max-h-56 overflow-y-hidden">
    <LiverCounterManager :settings="liverCounter" :counters="previewCounters" :event-labels="previewEventLabels" />
  </div>

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

  <!-- カラーパターン（奇数） -->
  <SettingItem label="メインカラー" description="奇数番目のカウンターの色" :showReset="true" @reset="resetMap.colorOdd">
    <div class="flex flex-wrap gap-2 items-center">
      <!-- null オプション -->
      <div
        class="badge cursor-pointer"
        :class="liverCounter.colorOdd === null ? 'badge-primary' : 'badge-outline'"
        @click="updateField('colorOdd', null)"
      >
        🔧カスタム
      </div>
      <div
        v-for="variant in BaseVariantLabels"
        :key="variant"
        class="badge cursor-pointer"
        :class="liverCounter.colorOdd === variant ? 'badge-primary' : 'badge-outline'"
        @click="updateField('colorOdd', variant)"
      >
        {{ variant }}
      </div>
    </div>
  </SettingItem>

  <!-- カラーパターン2（偶数） -->
  <SettingItem
    v-if="liverCounter.colorOdd !== null && totalCounterCount > 1"
    label="サブカラー"
    description="偶数番目のカウンターの色"
    :showReset="true"
    @reset="resetMap.colorEven"
  >
    <div class="flex flex-wrap gap-2 items-center">
      <!-- null オプション -->
      <div
        class="badge cursor-pointer"
        :class="liverCounter.colorEven === null ? 'badge-primary' : 'badge-outline'"
        @click="updateField('colorEven', null)"
      >
        メインと同じ
      </div>
      <div
        v-for="variant in BaseVariantLabels"
        :key="variant"
        class="badge cursor-pointer"
        :class="liverCounter.colorEven === variant ? 'badge-primary' : 'badge-outline'"
        @click="updateField('colorEven', variant)"
      >
        {{ variant }}
      </div>
    </div>
  </SettingItem>

  <!-- colorCycle（任意カラーリスト） -->
  <SettingItem
    v-if="liverCounter.colorOdd === null"
    label="カスタムパターン"
    description="複数の色を順番に適用します"
    :showReset="true"
    @reset="resetMap.colorCycle"
  >
    <input
      type="text"
      class="input input-bordered w-full"
      :value="liverCounter.colorCycle.join(',')"
      @input="
        (e) => {
          const raw = (e.target as HTMLInputElement).value
          const arr = raw
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
          updateField('colorCycle', arr)
        }
      "
    />
  </SettingItem>

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
    label="イベントカウンター"
    description="クリックした順番に並びます"
    :showReset="true"
    @reset="resetMap.eventCounters"
  >
    <div v-if="availableEventRules.length === 0" class="text-xs text-base-content/50">
      コメントルールが設定されていません
    </div>
    <div v-else class="flex flex-wrap gap-2">
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

  <!-- ラベル（特定アイテム用） -->
  <SettingItem
    v-if="false"
    label="ラベル"
    description="特定のカウンターに使うタイトル"
    :showReset="true"
    @reset="resetMap.label"
  >
    <input
      type="text"
      class="input input-bordered w-full"
      :value="liverCounter.label"
      @input="(e) => updateField('label', (e.target as HTMLInputElement).value)"
    />
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsLiverCounterSchema, liverComponentMap, liverDefaultMap } from '@/types/'
  import type { LiverDefaultKey, SettingsLiverCounterType } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import LiverCounterManager from '@main/ui/LiverCounter/parts/LiverCounterManager.vue'
  import { BaseVariantLabels } from '@shared/components/parts/ItemVariantTypes'
  import { themes } from '@shared/styles/DaisyUiTheme'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv, isPro } = useSettingMode()

  const liverCounter = computed(
    () => data.value.components.settings.liverCounter ?? SettingsLiverCounterSchema.parse({})
  )

  // ---- Field Update ----
  const updateField = (field: keyof SettingsLiverCounterType, value: unknown) => {
    omikujiStore.updateComponentSettings('liverCounter', {
      ...liverCounter.value,
      [field]: value,
    })
  }

  const resetField = (field: keyof SettingsLiverCounterType) => {
    const defaults = SettingsLiverCounterSchema.parse({})
    updateField(field, defaults[field])
  }

  const resetMap = {
    colorOdd: () => resetField('colorOdd'),
    colorEven: () => resetField('colorEven'),
    colorCycle: () => resetField('colorCycle'),
    defaultCounters: () => resetField('defaultCounters'),
    eventCounters: () => resetField('eventCounters'),
    label: () => resetField('label'),
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

  // ---- eventCounters トグル ----
  // data.value.comments は Record<string, BaseRecordType> で、key フィールドがルールIDに対応
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

  // ---- プレビュー用ダミーデータ ----
  const previewCounters = computed<Record<string, number>>(() => {
    const result: Record<string, number> = {
      upVote: 123,
      viewer: 456,
      syoken: 12,
      commenter: 789,
      lc: 234,
      totalPrice: 5000,
    }
    for (const key of liverCounter.value.eventCounters) {
      result[key] = 7
    }
    return result
  })

  const previewEventLabels = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {}
    for (const rule of availableEventRules.value) {
      result[rule.key] = rule.name
    }
    return result
  })
</script>
