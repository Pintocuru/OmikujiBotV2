<!-- src\ConfigMaker\components\rules\OmikujiItemCriteria.vue -->
<template>
  <!-- criteriaがnullの場合は何も表示しない -->
  <div v-if="criteria !== null" class="space-y-4">
    <!-- 条件設定の説明 -->
    <InformationCard>
      <p>
        <code class="label bg-accent text-accent-content">追加発動条件</code>は、
        コメント内容やチャット数などを基にルール発動を制御します。
      </p>
      <p>条件が複数ある場合は、すべて満たしたときのみ発動します。</p>
      <p>管理者限定コマンドなどの応用も可能です。</p>
    </InformationCard>

    <div class="flex items-center gap-4">
      <div class="form-control flex-1">
        <!-- 条件タイプ選択 -->
        <SettingItem label="適用する発動条件" description="トリガーの種類を選択">
          <div class="flex flex-wrap gap-2">
            <label
              v-for="condition in conditionTypes"
              :key="condition.value"
              class="flex items-center gap-2 hover:bg-base-300 p-2 rounded cursor-pointer"
            >
              <input
                type="checkbox"
                class="checkbox checkbox-primary"
                :checked="isConditionChecked(condition.value)"
                @change="toggleCondition(condition.value)"
              />
              <span class="text-sm">{{ condition.label }}</span>
            </label>
          </div>
        </SettingItem>
      </div>
    </div>

    <!-- 各条件の詳細設定 -->
    <div class="flex items-center gap-4">
      <div class="form-control flex-1">
        <!-- チャットワード条件 -->
        <ThresholdComment
          v-if="isConditionChecked('comment')"
          :modelValue="criteria?.comment ?? []"
          @update:modelValue="updateCriteriaProperty('comment', $event)"
        />

        <!-- アクセスレベル条件 -->
        <TriggerAccess
          v-if="isConditionChecked('access')"
          :modelValue="criteria?.access ?? []"
          @update:modelValue="updateCriteriaProperty('access', $event)"
        />

        <!-- カウント条件 -->
        <TriggerCount
          v-if="isConditionChecked('count')"
          :modelValue="criteria?.count ?? { comparison: 'lowerBound', unit: 'lc', value: 0 }"
          @update:modelValue="updateCriteriaProperty('count', $event)"
        />
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
  import {
    CriteriaThresholdCondition,
    criteriaThresholdConditionLabels,
    CriteriaThresholdSchema,
    CriteriaThresholdType,
  } from '@/types/OmikujiProcess/CriteriaThresholdSchema'

  import InformationCard from '@shared/components/parts/InformationCard.vue'

  import ThresholdComment from '@shared/components/threshold/ThresholdComment.vue'
  import TriggerAccess from '@shared/components/trigger/TriggerAccess.vue'
  import TriggerCount from '@shared/components/trigger/TriggerCount.vue'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()

  const omikujiStore = useOmikujiStore()

  const index = computed(() => props.allOmikuji.findIndex((item) => item.key === props.omikuji.key))

  // 条件タイプの選択肢
  const conditionTypes = Object.entries(criteriaThresholdConditionLabels).map(([value, label]) => ({
    value: value as CriteriaThresholdCondition,
    label,
  }))

  // 現在のcriteria
  const criteria = computed(() => props.omikuji.criteria)

  // 条件がチェックされているか判定
  const isConditionChecked = (condition: CriteriaThresholdCondition): boolean => {
    return criteria.value?.conditions?.includes(condition) ?? false
  }

  // Utils
  const toggleInArray = <T,>(array: T[], value: T): T[] => {
    const index = array.indexOf(value)
    return index > -1 ? array.filter((_, i) => i !== index) : [...array, value]
  }

  // 条件のトグル
  const toggleCondition = (condition: CriteriaThresholdCondition) => {
    if (index.value === -1 || !props.selectedItemKey) return

    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => {
      const currentCriteria = item.criteria
      const currentConditions = currentCriteria?.conditions ?? []
      const newConditions = toggleInArray(currentConditions, condition)

      return {
        ...item,
        criteria: currentCriteria
          ? { ...currentCriteria, conditions: newConditions }
          : { ...CriteriaThresholdSchema.parse({}), conditions: newConditions },
      }
    })
  }

  // criteriaのプロパティ更新
  const updateCriteriaProperty = <K extends keyof CriteriaThresholdType>(key: K, value: CriteriaThresholdType[K]) => {
    if (index.value === -1 || !props.selectedItemKey) return

    omikujiStore.updateOmikujiByIndex(props.category, props.selectedItemKey, index.value, (item) => {
      const currentCriteria = item.criteria

      return {
        ...item,
        criteria: currentCriteria
          ? { ...currentCriteria, [key]: value }
          : { ...CriteriaThresholdSchema.parse({}), [key]: value },
      }
    })
  }
</script>
