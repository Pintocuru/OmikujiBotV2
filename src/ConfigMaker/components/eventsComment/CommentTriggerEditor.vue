<!-- src/ConfigMaker/components/eventsComment/CommentTriggerEditor.vue -->
<template>
  <!-- 条件設定の説明 -->
  <InformationCard>
    <p>
      <code class="label bg-accent text-accent-content">発動条件設定</code>では、
      ユーザーのギフト有無やチャット数などを基にイベント発動を制御します。
    </p>
    <p>条件が複数ある場合は、すべて満たしたときのみ発動します。(ANDのみ対応)</p>
    <p class="text-xs opacity-70">
      ※ 初見判定ちゃん・チャット数は v2 以降非推奨となりました。代わりに「追加発動条件」で設定できます。
    </p>
  </InformationCard>

  <!-- 条件タイプ選択 -->
  <SettingItem label="適用する発動条件" description="トリガーの種類を選択">
    <div class="flex flex-wrap gap-2">
      <label v-for="condition in conditionTypes" :key="condition.value" class="cursor-pointer">
        <input
          type="checkbox"
          class="hidden"
          :checked="conditions.includes(condition.value)"
          @change="toggleCondition(condition.value)"
        />
        <span
          class="badge badge-lg select-none"
          :class="conditions.includes(condition.value) ? 'badge-primary' : 'badge-ghost'"
        >
          {{ condition.label }}
        </span>
      </label>
    </div>
  </SettingItem>

  <!-- 各条件の詳細設定 -->
  <!-- チャットワード条件 -->
  <ThresholdComment v-if="conditions.includes('comment')" v-model="comment" />

  <!-- アクセスレベル条件 -->
  <TriggerAccess v-if="conditions.includes('access')" v-model="access" />

  <!-- ギフト条件 -->
  <ThresholdGift v-if="conditions.includes('gift')" v-model="gift" />

  <!-- ユーザーネーム条件 -->
  <ThresholdUsername v-if="conditions.includes('username')" v-model="userName" />

  <!-- 初見条件 -->
  <ThresholdSyoken v-if="syoken && conditions.includes('syoken')" v-model="syoken" />

  <!-- カウント条件 -->
  <TriggerCount v-if="count && conditions.includes('count')" v-model="count" />

  <!-- 条件未記入ですべてのコメントで適用 -->
  <NoParamsCard v-if="conditions.length === 0" message="すべてのコメントで適用されます" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'

  import ThresholdComment from '@shared/components/threshold/ThresholdComment.vue'
  import ThresholdGift from '@shared/components/threshold/ThresholdGift.vue'
  import ThresholdUsername from '@shared/components/threshold/ThresholdUsername.vue'

  import TriggerAccess from '@shared/components/trigger/TriggerAccess.vue'
  import ThresholdSyoken from '@shared/components/threshold/ThresholdSyoken.vue'
  import TriggerCount from '@shared/components/trigger/TriggerCount.vue'

  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import {
    commentTriggerCondition,
    CommentTriggerCondition,
    commentTriggerConditionMap,
    CommentTriggerType,
  } from '@/types'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'

  const props = defineProps<{
    modelValue: CommentTriggerType
    selectedItemKey: string | null
  }>()

  // Pinia store
  const { updateRecordProperty } = useOmikujiStore()

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof CommentTriggerType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedItemKey) return
        const updated = { ...props.modelValue, [key]: value }
        updateRecordProperty('comments', props.selectedItemKey, 'trigger', updated)
      },
    })

  // 各プロパティのcomputed
  const conditions = createComputed('conditions')
  const comment = createComputed('comment')
  const access = createComputed('access')
  const gift = createComputed('gift')
  const userName = createComputed('userName')
  const syoken = createComputed('syoken')
  const count = createComputed('count')

  // 条件タイプの選択肢
  const baseConditionTypes = commentTriggerCondition
    .filter((key) => key !== 'syoken' && key !== 'count')
    .map((key) => ({
      value: key,
      label: commentTriggerConditionMap[key].label,
      description: commentTriggerConditionMap[key].description,
    }))

  const deprecatedConditions = ['syoken', 'count'] as const

  type ConditionOption = {
    value: CommentTriggerCondition
    label: string
  }

  const conditionTypes = computed<ConditionOption[]>(() => {
    const list: ConditionOption[] = [...baseConditionTypes]

    for (const key of deprecatedConditions) {
      if (props.modelValue[key] !== undefined) {
        list.push({
          value: key,
          label: commentTriggerConditionMap[key].label,
        })
      }
    }

    return list
  })

  // Utils
  const toggleInArray = <T,>(array: T[], value: T): T[] => {
    const index = array.indexOf(value)
    return index > -1 ? array.filter((_, i) => i !== index) : [...array, value]
  }

  // Handlers
  const toggleCondition = (condition: CommentTriggerCondition) => {
    conditions.value = toggleInArray(conditions.value, condition)
  }
</script>
