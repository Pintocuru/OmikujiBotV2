<!-- src/configMaker/components/comments/ThresholdEditor.vue -->
<template>
  <SectionCard>
    <template #header>
      <div>発動条件設定</div>
      <div class="text-sm pr-2">コメントの情報から「おみくじを引く」かどうかを決めます</div>
    </template>

    <template #body>
      <!-- 条件設定の説明 -->
      <InformationCard>
        <p>
          <code class="label bg-accent text-accent-content">発動条件設定</code>では、
          コメントを送ったユーザーの「ギフトの有無」や「チャット数」などの情報をもとに、
        </p>
        <p>ルールを発動するかどうかを決めることができます。</p>
        <p>
          <code class="label bg-accent text-accent-content">発動条件が複数の場合は、すべての条件を満たしたときだけ</code
          >ルールが発動します。
        </p>
      </InformationCard>

      <!-- 条件タイプ選択 -->
      <SettingItem label="適用する発動条件" description="トリガーの種類を選択" :show-reset="false">
        <div class="flex flex-wrap gap-2">
          <label
            v-for="condition in conditionTypes"
            :key="condition.value"
            class="flex items-center gap-2 hover:bg-base-300 p-2 rounded cursor-pointer"
          >
            <input
              type="checkbox"
              class="checkbox checkbox-primary"
              :checked="conditions.includes(condition.value)"
              @change="toggleCondition(condition.value)"
            />
            <span class="text-sm">{{ condition.label }}</span>
          </label>
        </div>
      </SettingItem>

      <!-- 各条件の詳細設定 -->
      <!-- チャットワード条件 -->
      <ThresholdConditionComment v-if="conditions.includes('comment')" v-model="comment" />

      <!-- 初見条件 -->
      <ThresholdConditionSyoken v-if="conditions.includes('syoken')" v-model="syoken" />

      <!-- アクセスレベル条件 -->
      <ThresholdConditionAccess v-if="conditions.includes('access')" v-model="access" />

      <!-- ギフト条件 -->
      <ThresholdConditionGift v-if="conditions.includes('gift')" v-model="gift" />

      <!-- カウント条件 -->
      <ThresholdConditionCount v-if="conditions.includes('count')" v-model="count" />
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import ThresholdConditionComment from './ThresholdConditionComment.vue'
  import ThresholdConditionSyoken from './ThresholdConditionSyoken.vue'
  import ThresholdConditionAccess from './ThresholdConditionAccess.vue'
  import ThresholdConditionGift from './ThresholdConditionGift.vue'
  import ThresholdConditionCount from './ThresholdConditionCount.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import InformationCard from '@ConfigComponents/parts/InformationCard.vue'
  import { Info } from 'lucide-vue-next'

  import { commentThresholdConditionLabels, CommentThresholdCondition, CommentThresholdType } from '@shared/types'
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

  const props = defineProps<{
    modelValue: CommentThresholdType
    selectedRuleId: string | null
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof CommentThresholdType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedRuleId) return
        const updated = { ...props.modelValue, [key]: value }
        omikujiStore.updateRecordProperty('comments', props.selectedRuleId, 'threshold', updated)
      },
    })

  // 各プロパティのcomputed
  const conditions = createComputed('conditions')
  const comment = createComputed('comment')
  const syoken = createComputed('syoken')
  const access = createComputed('access')
  const gift = createComputed('gift')
  const count = createComputed('count')

  // 条件タイプの選択肢
  const conditionTypes = Object.entries(commentThresholdConditionLabels).map(([value, label]) => ({
    value: value as CommentThresholdCondition,
    label,
  }))

  // Utils
  const toggleInArray = <T,>(array: T[], value: T): T[] => {
    const index = array.indexOf(value)
    return index > -1 ? array.filter((_, i) => i !== index) : [...array, value]
  }

  // Handlers
  const toggleCondition = (condition: CommentThresholdCondition) => {
    conditions.value = toggleInArray(conditions.value, condition)
  }
</script>
