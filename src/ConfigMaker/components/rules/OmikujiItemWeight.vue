<!-- src\ConfigMaker\components\rules\OmikujiItemWeight.vue -->
<template>
  <div class="space-y-4">
    <!-- 追加発動条件の有効化 -->
    <div class="form-control">
      <SettingItem label="追加発動条件を設定する" description="条件を満たした場合の優先度を設定できます">
        <label class="label cursor-pointer gap-2">
          <input
            type="checkbox"
            class="toggle toggle-primary"
            :checked="hasCriteria"
            @change="toggleCriteria(($event.target as HTMLInputElement).checked)"
          />
          <span class="label-text">設定する</span>
        </label>
      </SettingItem>
    </div>

    <div class="flex items-center gap-4">
      <!-- 優先度（criteriaがある場合のみ表示） -->
      <div v-if="hasCriteria" class="form-control flex-1">
        <SettingItem label="優先度" description="追加条件達成時、優先で選ばれます">
          <label class="label cursor-pointer gap-2">
            <input
              type="checkbox"
              class="toggle toggle-primary"
              :checked="omikuji.isPriority"
              @change="updatePriority(($event.target as HTMLInputElement).checked)"
            />
            <span class="label-text">優先度を上げる</span>
          </label>
        </SettingItem>
      </div>

      <!-- 重み -->
      <div v-if="!omikuji.isPriority" class="form-control flex-1">
        <SettingItem :label="`重み (${weightPercentage}%)`" description="数値が高いほど出やすくなります">
          <input
            type="number"
            :value="omikuji.weight"
            @input="updateWeight(parseFloat(($event.target as HTMLInputElement).value))"
            min="0"
            class="input input-bordered input-sm w-full"
          />
        </SettingItem>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { CriteriaThresholdSchema } from '@/types/OmikujiProcess/CriteriaThresholdSchema'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const omikujiStore = useOmikujiStore()

  const index = computed(() => props.allOmikuji.findIndex((item) => item.key === props.omikuji.key))

  // criteriaが設定されているか
  const hasCriteria = computed(() => props.omikuji.criteria !== null)

  // 全体の重みの合計を計算
  const totalWeight = computed(() => {
    return props.allOmikuji.reduce((sum, item) => sum + (item.weight || 0), 0)
  })

  // 現在のおみくじの出現率を計算
  const weightPercentage = computed(() => {
    if (totalWeight.value === 0) return '0.00'
    return ((props.omikuji.weight / totalWeight.value) * 100).toFixed(2)
  })

  // 重み更新
  const updateWeight = (value: number) => {
    if (index.value === -1 || !props.selectedItemKey) return
    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      weight: value,
    }))
  }

  // 優先度更新
  const updatePriority = (value: boolean) => {
    if (index.value === -1 || !props.selectedItemKey) return
    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      isPriority: value,
    }))
  }

  // criteriaのトグル
  const toggleCriteria = (enabled: boolean) => {
    if (index.value === -1 || !props.selectedItemKey) return
    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => ({
      ...item,
      isPriority: enabled,
      criteria: enabled ? CriteriaThresholdSchema.parse({}) : null,
    }))
  }
</script>
