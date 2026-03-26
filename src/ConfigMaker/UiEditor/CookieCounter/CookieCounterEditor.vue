<template>
  <!-- プレビュー -->
  <CookieCounterPreview
    :cookieCounter="cookieCounter"
    :event-labels="previewEventLabels"
    :variable-labels="variableInput"
  />

  <!-- コンポーネント選択 -->
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

  <!-- テーマカラー -->
  <DaisyUiThemeEditor
    v-if="isAdv && cookieComponentMap[cookieCounter.component].isColor"
    :model-value="cookieCounter.color"
    @update:model-value="(newValue) => updateField('color', newValue)"
  />

  <!-- 標準カウンター選択 (StreamDefault) -->
  <SettingItem
    label="標準カウンター"
    description="表示したい項目を選択してください"
    :showReset="true"
    @reset="updateField('counters', [])"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="(label, key) in streamDefaultMap"
        :key="key"
        class="badge cursor-pointer"
        :class="isCounterSelected('default', key) ? 'badge-primary' : 'badge-outline'"
        @click="toggleCounter('default', key, label)"
      >
        {{ label }}
      </div>
    </div>
  </SettingItem>

  <!-- イベントカウンター選択 -->
  <SettingItem
    v-if="availableEventRules.length > 0"
    label="カスタムイベント"
    description="設定済みのコメント演出をカウントします"
  >
    <div class="flex flex-wrap gap-2">
      <div
        v-for="rule in availableEventRules"
        :key="rule.key"
        class="badge cursor-pointer"
        :class="isCounterSelected('event', rule.key) ? 'badge-secondary' : 'badge-outline'"
        @click="toggleCounter('event', rule.key, rule.name)"
      >
        {{ rule.name }}
      </div>
    </div>
  </SettingItem>

  <!-- 変数カウンター入力 (Variable) -->
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
          :disabled="!variableInput.target || !variableInput.label || totalCounterCount >= 8"
          @click="addVariableCounter"
        >
          追加
        </button>
      </div>

      <!-- 追加済みの変数リスト -->
      <div class="flex flex-wrap gap-2">
        <div
          v-for="c in variableCounters"
          :key="c.id"
          class="badge badge-accent gap-2 cursor-pointer"
          @click="removeCounter(c.id)"
        >
          <!-- TODO;ここはlucide -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block w-4 h-4 stroke-current"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          {{ c.label }} ({{ c.target }})
        </div>
      </div>
    </div>
  </SettingItem>

  <!-- 選択中の順番確認 -->
  <div v-if="cookieCounter.counters.length > 0" class="mt-4 p-4 bg-base-200 rounded-box text-sm">
    <div class="font-bold mb-2">表示順（最大 {{ huga }} 個）: 現在 {{ totalCounterCount }}個</div>
    <div class="flex flex-wrap gap-1">
      <div v-for="(c, i) in cookieCounter.counters" :key="c.id" class="badge badge-ghost gap-1">
        <span class="opacity-50 text-[10px]">{{ i + 1 }}</span>
        {{ getCounterLabel(c) }}
        <button class="btn btn-ghost btn-xs px-0 min-h-0 h-auto" @click.stop="removeCounter(c.id)">×</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, reactive } from 'vue'
  import { storeToRefs } from 'pinia'
  import { cookieComponentMap, CookieCounterSchema, CookieCounterCountersSchema, streamDefaultMap } from '@/types/'
  import type { CookieCounterType } from '@/types/'
  import CookieCounterPreview from './CookieCounterPreview.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import DaisyUiThemeEditor from '@config/components/common/ThemeColorPicker/DaisyUiThemeEditor.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isAdv, isPro } = useSettingMode()

  // 変数入力用のローカルステート
  const variableInput = reactive({
    target: '',
    label: '',
  })

  // スキーマに従って現在の設定を取得
  const cookieCounter = computed(() => {
    return data.value.components.settings.cookieCounter ?? CookieCounterSchema.parse({})
  })

  const totalCounterCount = computed(() => cookieCounter.value.counters.length)

  const variableCounters = computed(() => cookieCounter.value.counters.filter((c) => c.type === 'variable'))

  const huga = computed(() => cookieComponentMap[cookieCounter.value.component].maxCounters)

  // ---- Field Update ----
  const updateField = (field: keyof CookieCounterType, value: unknown) => {
    omikujiStore.updateComponentSettings('cookieCounter', {
      ...cookieCounter.value,
      [field]: value,
    })
  }

  // ---- カウンター制御ロジック ----

  // 選択されているか判定
  const isCounterSelected = (type: 'default' | 'event' | 'variable', target: string) => {
    return cookieCounter.value.counters.some((c) => c.type === type && c.target === target)
  }

  // 特定のIDを削除
  const removeCounter = (id: string) => {
    const currentCounters = cookieCounter.value.counters.filter((c) => c.id !== id)
    updateField('counters', currentCounters)
  }

  // カウンターの追加・削除 (Toggle用)
  const toggleCounter = (type: 'default' | 'event', target: string, label?: string) => {
    const currentCounters = [...cookieCounter.value.counters]
    const index = currentCounters.findIndex((c) => c.type === type && c.target === target)

    if (index !== -1) {
      currentCounters.splice(index, 1)
    } else {
      if (totalCounterCount.value >= huga.value) return
      try {
        const newItem = CookieCounterCountersSchema.parse({
          type,
          target,
          label: type !== 'default' ? label || target : undefined,
        })
        currentCounters.push(newItem)
      } catch (e) {
        console.error('Failed to parse counter item:', e)
        return
      }
    }
    updateField('counters', currentCounters)
  }

  // 変数カウンターの追加
  const addVariableCounter = () => {
    if (!variableInput.target || !variableInput.label || totalCounterCount.value >= 8) return

    try {
      const newItem = CookieCounterCountersSchema.parse({
        type: 'variable',
        target: variableInput.target,
        label: variableInput.label,
      })

      const currentCounters = [...cookieCounter.value.counters, newItem]
      updateField('counters', currentCounters)

      // 入力をクリア
      variableInput.target = ''
      variableInput.label = ''
    } catch (e) {
      console.error('Failed to add variable counter:', e)
    }
  }

  // ラベル取得用ヘルパー
  const getCounterLabel = (counter: any) => {
    if (counter.type === 'default') {
      const key = counter.target as keyof typeof streamDefaultMap
      return streamDefaultMap[key] ?? counter.target
    }
    return counter.label || counter.target
  }

  // ---- イベントルール関連 ----
  const availableEventRules = computed(() => {
    return Object.values(data.value.comments || {}).map((record) => ({
      key: record.key,
      name: record.name || record.key,
    }))
  })

  const previewEventLabels = computed<Record<string, string>>(() => {
    const result: Record<string, string> = {}
    for (const rule of availableEventRules.value) {
      result[rule.key] = rule.name
    }
    return result
  })
</script>
