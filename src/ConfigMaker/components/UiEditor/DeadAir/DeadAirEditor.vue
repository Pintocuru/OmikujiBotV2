<!-- src/ConfigMaker/components/UiEditor/DeadAir/DeadAirEditor.vue -->
<template>
  <!-- プレビュー -->
  <DeadAirPreview :deadAir="deadAir" />

  <!-- コンポーネント選択 -->
  <SettingItem label="表示スタイル" description="表示形式を選択">
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in deadComponentMap"
        :key="key"
        class="badge cursor-pointer"
        :class="deadAir.component === key ? 'badge-primary' : 'badge-outline'"
        @click="updateField('component', key)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- 背景色 -->
  <SettingItem label="背景色" description="ウィジェット背景を選択">
    <div class="flex gap-2">
      <div
        v-for="color in bgColorOptions"
        :key="color.value"
        class="badge cursor-pointer"
        :class="deadAir.bgColor === color.value ? 'badge-primary' : 'badge-outline'"
        @click="updateField('bgColor', color.value)"
      >
        {{ color.label }}
      </div>
    </div>
  </SettingItem>

  <!-- タイマー初期値 -->
  <SettingItem label="タイマー初期値（分）" description="1〜60分">
    <input
      type="number"
      class="input input-bordered w-24"
      :value="deadAir.initialMinutes"
      min="1"
      max="60"
      @change="(e) => updateField('initialMinutes', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>

  <!-- ライフ初期値 -->
  <SettingItem label="ライフ初期値" description="3〜10">
    <input
      type="number"
      class="input input-bordered w-24"
      :value="deadAir.initialLives"
      min="3"
      max="10"
      @change="(e) => updateField('initialLives', Number((e.target as HTMLInputElement).value))"
    />
  </SettingItem>

  <!-- ボーナス機能 -->
  <SettingItem label="ボーナス機能" description="タイマー超過分を蓄積し、ライフ回復に変換する">
    <input
      type="checkbox"
      class="toggle toggle-primary"
      :checked="deadAir.bonusEnabled"
      @change="(e) => updateField('bonusEnabled', (e.target as HTMLInputElement).checked)"
    />
  </SettingItem>

  <!-- オプション表示キー -->
  <SettingItem
    label="オプション表示"
    description="3列目に表示するカウンターキー（空欄で非表示）"
    :showReset="true"
    @reset="updateField('optionalCounterKey', null)"
  >
    <select
      class="select select-bordered"
      :value="deadAir.optionalCounterKey ?? ''"
      @change="
        (e) => {
          const v = (e.target as HTMLSelectElement).value
          updateField('optionalCounterKey', v === '' ? null : v)
        }
      "
    >
      <option value="">非表示</option>
      <option v-for="key in availableCounterKeys" :key="key" :value="key">
        {{ key }}
      </option>
    </select>
  </SettingItem>

  <!-- イベントルール -->
  <SettingItem
    label="イベントルール"
    description="カウンターの増加に応じてタイマー・ライフを増やす設定"
    :showReset="true"
    @reset="updateField('eventRules', [])"
  >
    <div class="flex flex-col gap-2 w-full">
      <!-- 既存ルール一覧 -->
      <div
        v-for="(rule, index) in deadAir.eventRules"
        :key="index"
        class="flex flex-wrap items-center gap-2 p-2 rounded bg-base-200"
      >
        <!-- counterKey -->
        <select
          class="select select-bordered select-sm"
          :value="rule.counterKey"
          @change="(e) => updateRule(index, 'counterKey', (e.target as HTMLSelectElement).value)"
        >
          <option value="">-- キーを選択 --</option>
          <option v-for="key in availableCounterKeys" :key="key" :value="key">
            {{ key }}
          </option>
        </select>

        <!-- effect -->
        <div class="flex gap-1">
          <div
            v-for="opt in effectOptions"
            :key="opt.value"
            class="badge cursor-pointer"
            :class="rule.effect === opt.value ? 'badge-secondary' : 'badge-outline'"
            @click="updateRule(index, 'effect', opt.value)"
          >
            {{ opt.label }}
          </div>
        </div>

        <!-- value -->
        <label class="flex items-center gap-1 text-sm">
          増加
          <input
            type="number"
            class="input input-bordered input-sm w-16"
            :value="rule.value"
            min="1"
            max="10"
            @change="(e) => updateRule(index, 'value', Number((e.target as HTMLInputElement).value))"
          />
          <span>{{ rule.effect === 'timer' ? '分' : '個' }}</span>
        </label>

        <!-- threshold -->
        <label class="flex items-center gap-1 text-sm">
          しきい値
          <input
            type="number"
            class="input input-bordered input-sm w-20"
            :value="rule.threshold"
            min="1"
            @change="(e) => updateRule(index, 'threshold', Number((e.target as HTMLInputElement).value))"
          />
          ごと
        </label>

        <!-- 削除 -->
        <button class="btn btn-xs btn-ghost text-error" @click="removeRule(index)">✕</button>
      </div>

      <!-- ルール追加 -->
      <button class="btn btn-sm btn-outline w-full" @click="addRule">＋ ルールを追加</button>
    </div>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsDeadSchema, deadComponentMap } from '@/types/OmikujiData/UiSettings/SettingsDeadSchema'
  import type { SettingsDeadType, DeadEventRuleType } from '@/types/OmikujiData/UiSettings/SettingsDeadSchema'
  import DeadAirPreview from './DeadAirPreview.vue'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const deadAir = computed<SettingsDeadType>(
    () => data.value.components.settings.deadAir ?? SettingsDeadSchema.parse({})
  )

  // ---------------------------------------------------------------------------
  // Field update
  // ---------------------------------------------------------------------------

  const updateField = (field: keyof SettingsDeadType, value: unknown) => {
    omikujiStore.updateComponentSettings('deadAir', {
      ...deadAir.value,
      [field]: value,
    })
  }

  // ---------------------------------------------------------------------------
  // イベントルール操作
  // ---------------------------------------------------------------------------

  const addRule = () => {
    updateField('eventRules', [
      ...deadAir.value.eventRules,
      { counterKey: '', effect: 'timer', value: 1, threshold: 1 } satisfies DeadEventRuleType,
    ])
  }

  const removeRule = (index: number) => {
    updateField(
      'eventRules',
      deadAir.value.eventRules.filter((_, i) => i !== index)
    )
  }

  const updateRule = (index: number, field: keyof DeadEventRuleType, value: unknown) => {
    const rules = deadAir.value.eventRules.map((r, i) => (i === index ? { ...r, [field]: value } : r))
    updateField('eventRules', rules)
  }

  // ---------------------------------------------------------------------------
  // 選択肢
  // ---------------------------------------------------------------------------

  const bgColorOptions = [
    { value: 'black', label: '黒' },
    { value: 'white', label: '白' },
  ] as const

  const effectOptions = [
    { value: 'timer', label: 'タイマー' },
    { value: 'life', label: 'ライフ' },
  ] as const

  /** counterKey の選択肢：標準キー + comments に登録済みのイベントキー */
  const availableCounterKeys = computed(() => {
    const standard = ['syoken', 'commenter', 'lc', 'upVote', 'viewer', 'totalPrice']
    const eventKeys = Object.values(data.value.comments)
      .map((r) => r.key)
      .filter(Boolean)
    return [...new Set([...standard, ...eventKeys])]
  })
</script>
