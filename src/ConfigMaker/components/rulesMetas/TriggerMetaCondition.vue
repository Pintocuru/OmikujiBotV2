<!-- shared/components/trigger/TriggerMetaCondition.vue -->
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
  import {
    MetaConditionType,
    MetaSimpleConditionType,
    metaComparisonConditionMap,
    MetaSimpleComparisonConditionMap,
  } from '@/types/OmikujiProcess/MetaTriggerSchema'

  const props = defineProps<{
    modelValue?: MetaConditionType | MetaSimpleConditionType
    label: string
    description: string
    hasPeak: boolean // Peak比較が可能かどうか
  }>()

  const emit = defineEmits<{
    (e: 'update:modelValue', value: MetaConditionType | MetaSimpleConditionType): void
  }>()

  // 比較オプション
  const comparisonOptions = computed(() => {
    const map = props.hasPeak ? metaComparisonConditionMap : MetaSimpleComparisonConditionMap
    return Object.entries(map).map(([value, info]) => ({
      value,
      label: info.label,
    }))
  })

  // 数値入力が必要な比較方法
  const needsValue = computed(() => {
    const comparison = props.modelValue?.comparison
    return ['lowerBound', 'upperBound', 'equal', 'loop'].includes(comparison || '')
  })

  // プレースホルダー
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

  // 説明テキスト
  const comparisonDescription = computed(() => {
    const comparison = props.modelValue?.comparison
    if (!comparison) return ''

    const map = props.hasPeak ? metaComparisonConditionMap : MetaSimpleComparisonConditionMap
    return map[comparison as keyof typeof map]?.description || ''
  })

  // フィールド更新
  const updateField = (field: 'comparison' | 'value', value: string | number) => {
    const updated = { ...props.modelValue } as MetaConditionType | MetaSimpleConditionType

    // フィールド更新
    ;(updated as any)[field] = value

    // 不要なら削除
    if (field === 'comparison' && !['lowerBound', 'upperBound', 'equal', 'loop'].includes(value as string)) {
      delete (updated as MetaConditionType).value
    }

    emit('update:modelValue', updated)
  }
</script>
