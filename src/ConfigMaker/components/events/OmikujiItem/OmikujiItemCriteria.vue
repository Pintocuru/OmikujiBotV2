<!-- src/ConfigMaker/components/events/OmikujiItem/OmikujiItemCriteria.vue -->
<template>
  <!-- 条件設定の説明 -->
  <InformationCard>
    <p>
      <code class="label bg-accent text-accent-content">追加発動条件</code>は、
      コメント内容やチャット数などを基にイベント発動を制御します。
    </p>
    <p>条件が複数ある場合は、すべて満たしたときのみ発動します。</p>
    <p>管理者限定コマンドなどの応用も可能です。</p>
  </InformationCard>

  <!-- 条件タイプ選択 -->
  <SettingItem
    label="適用する発動条件"
    description="トリガーの種類を選択"
    :variant="activeConditions.size === 0 ? 'warning' : undefined"
  >
    <div class="flex flex-wrap gap-2">
      <label v-for="condition in conditionTypes" :key="condition.value" class="cursor-pointer">
        <input
          type="checkbox"
          class="hidden"
          :checked="activeConditions.has(condition.value)"
          @change="toggleCondition(condition.value)"
        />
        <span
          class="badge badge-lg select-none"
          :class="activeConditions.has(condition.value) ? 'badge-primary' : 'badge-ghost'"
        >
          {{ condition.label }}
        </span>
      </label>
    </div>
  </SettingItem>

  <!-- 各条件の詳細設定 -->
  <!-- ユーザーネーム条件 -->
  <ThresholdUsername
    v-if="activeConditions.has('username')"
    :modelValue="criteria?.userName ?? []"
    @update:modelValue="updateCriteria('userName', $event)"
  />

  <!-- アクセスレベル条件 -->
  <TriggerAccess
    v-if="activeConditions.has('access')"
    :modelValue="criteria?.access ?? []"
    @update:modelValue="updateCriteria('access', $event)"
  />

  <!-- ギフト条件 -->
  <ThresholdGift
    v-if="activeConditions.has('gift')"
    :modelValue="criteria?.gift ?? []"
    @update:modelValue="updateCriteria('gift', $event)"
  />

  <!-- 初見条件 -->
  <ThresholdSyoken
    v-if="activeConditions.has('syoken')"
    :modelValue="criteria?.syoken ?? []"
    @update:modelValue="updateCriteria('syoken', $event)"
  />

  <!-- カウント条件 -->
  <TriggerCount
    v-if="activeConditions.has('count')"
    :modelValue="criteria?.count ?? CountConditionSchema.parse({})"
    @update:modelValue="updateCriteria('count', $event)"
  />

  <!-- チャットワード条件 -->
  <ThresholdComment
    v-if="activeConditions.has('comment')"
    :modelValue="criteria?.comment ?? []"
    @update:modelValue="updateCriteria('comment', $event)"
  />

  <!-- チャットワード条件 -->
  <NoParamsCard v-if="activeConditions.size === 0" message="発動条件が指定されていません" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import {
    OmikujiItemType,
    CriteriaThresholdCondition,
    criteriaThresholdConditionLabels,
    CriteriaThresholdSchema,
    CriteriaThresholdType,
  } from '@/types'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'

  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import ThresholdGift from '@shared/components/threshold/ThresholdGift.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import ThresholdComment from '@shared/components/threshold/ThresholdComment.vue'
  import TriggerAccess from '@shared/components/trigger/TriggerAccess.vue'
  import ThresholdSyoken from '@shared/components/threshold/ThresholdSyoken.vue'
  import TriggerCount from '@shared/components/trigger/TriggerCount.vue'
  import { CountConditionSchema } from '@shared/types'
  import ThresholdUsername from '@shared/components/threshold/ThresholdUsername.vue'

  const props = defineProps<{
    selectedItemKey: string | null
    omikuji: OmikujiItemType | null
    index: number
  }>()

  // 条件タイプの選択肢
  const conditionTypes = Object.entries(criteriaThresholdConditionLabels).map(([value, label]) => ({
    value: value as CriteriaThresholdCondition,
    label,
  }))

  // 現在のcriteria
  const criteria = computed(() => props.omikuji?.criteria)

  // アクティブな条件のSet（高速な検索のため）
  const activeConditions = computed(() => new Set(criteria.value?.conditions ?? []))

  // 条件のトグル
  const toggleCondition = (condition: CriteriaThresholdCondition) => {
    if (!isValidUpdate()) return

    const currentConditions = criteria.value?.conditions ?? []
    const newConditions = currentConditions.includes(condition)
      ? currentConditions.filter((c) => c !== condition)
      : [...currentConditions, condition]

    updateOmikuji((item) => ({
      ...item,
      criteria: ensureCriteria(item.criteria, { conditions: newConditions }),
    }))
  }

  // criteriaのプロパティ更新
  const updateCriteria = <K extends keyof CriteriaThresholdType>(key: K, value: CriteriaThresholdType[K]) => {
    if (!isValidUpdate()) return

    updateOmikuji((item) => ({
      ...item,
      criteria: ensureCriteria(item.criteria, { [key]: value }),
    }))
  }

  // ヘルパー関数: 更新可能かチェック
  const isValidUpdate = (): boolean => {
    return props.index !== -1 && props.selectedItemKey !== null
  }

  // ヘルパー関数: criteriaの存在を保証
  const ensureCriteria = (
    current: CriteriaThresholdType | null,
    updates: Partial<CriteriaThresholdType>
  ): CriteriaThresholdType => {
    const base = current ?? CriteriaThresholdSchema.parse({})
    return { ...base, ...updates }
  }

  // ヘルパー関数: おみくじの更新
  const updateOmikuji = (updater: (item: OmikujiItemType) => OmikujiItemType) => {
    const { updateOmikujiByIndex } = useOmikujiStore()
    updateOmikujiByIndex('comments', props.selectedItemKey!, props.index, updater)
  }
</script>
