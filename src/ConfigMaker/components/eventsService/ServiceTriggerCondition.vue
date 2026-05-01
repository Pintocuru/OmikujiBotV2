<!-- src/ConfigMaker/components/eventsService/ServiceTriggerCondition.vue -->
<template>
  <SettingItem :label="label" :description="description">
    <!-- 比較方法 -->
    <div class="flex flex-wrap gap-2 pb-2">
      <select
        :value="modelValue?.comparison"
        @change="updateField('comparison', ($event.target as HTMLSelectElement).value)"
        class="select select-bordered select-sm flex-1"
      >
        <option v-for="option in comparisonOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <!-- 数値入力（特定の比較方法のみ） -->
    <div v-if="needsValue" class="flex flex-wrap gap-2">
      <input
        type="number"
        :value="modelValue?.value"
        @input="updateField('value', Number(($event.target as HTMLInputElement).value))"
        min="0"
        class="input input-bordered input-sm flex-1"
        :placeholder="valuePlaceholder"
      />
    </div>

    <!-- 説明テキスト -->
    <p v-if="comparisonDescription" class="text-xs opacity-70 mt-1">
      {{ comparisonDescription }}
    </p>
  </SettingItem>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import SettingItem from '../parts/SettingItem.vue'
  import { ServiceConditionType, serviceConditionMap, serviceSimpleComparisonConditionMap } from '@/types'

  const props = defineProps<{
    modelValue?: ServiceConditionType
    label: string
    description: string
    hasPeak: boolean
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: ServiceConditionType): void
  }>()

  // ★ 初期値生成
  const defaultCondition = (): ServiceConditionType => ({
    comparison: 'changed',
    value: 0,
  })

  // ★ 初回だけ初期値を emit
  if (!props.modelValue) {
    emit('update:modelValue', defaultCondition())
  }

  // 以下は既存ロジック
  const comparisonOptions = computed(() => {
    const map = props.hasPeak ? serviceConditionMap : serviceSimpleComparisonConditionMap
    return Object.entries(map).map(([value, info]) => ({
      value,
      label: info.label,
    }))
  })

  const needsValue = computed(() => {
    const comparison = props.modelValue?.comparison
    return ['lowerBound', 'upperBound', 'equal', 'loop'].includes(comparison || '')
  })

  const valuePlaceholder = computed(() => {
    const comparison = props.modelValue?.comparison
    switch (comparison) {
      case 'lowerBound':
        return '下限値'
      case 'upperBound':
        return '上限値'
      case 'equal':
        return '指定値'
      case 'loop':
        return '増加単位（例：10）'
      default:
        return '数値'
    }
  })

  const comparisonDescription = computed(() => {
    const comparison = props.modelValue?.comparison
    if (!comparison) return ''
    const map = props.hasPeak ? serviceConditionMap : serviceSimpleComparisonConditionMap
    return map[comparison as keyof typeof map]?.description || ''
  })

  const updateField = (field: 'comparison' | 'value', value: string | number) => {
    const updated = { ...(props.modelValue ?? defaultCondition()) }

    if (field === 'comparison') {
      updated.comparison = value as ServiceConditionType['comparison']

      // comparison に応じて value を削除
      if (!['lowerBound', 'upperBound', 'equal', 'loop'].includes(updated.comparison)) {
        delete updated.value
      }
    } else {
      // field === 'value'
      updated.value = value as number
    }

    emit('update:modelValue', updated)
  }
</script>
