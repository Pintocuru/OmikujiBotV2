<!-- src/configMaker/components/comments/ThresholdEditor.vue -->
<template>
  <div class="card bg-base-300 mt-4">
    <div class="card-title bg-secondary p-2 pl-4 rounded-t flex items-center">発動条件設定</div>
    <div class="card-body space-y-4">
      <!-- 条件設定の説明 -->
      <div class="alert alert-info w-full">
        <Info class="w-5 h-5 mt-0.5 shrink-0" />
        <div class="space-y-1">
          <p>
            <code class="label bg-accent text-accent-content">発動条件設定</code>では、
            コメントを送ったユーザーの「ギフトの有無」や「チャット数」などの情報をもとに、
          </p>
          <p>ルールを発動するかどうかを決めることができます。</p>
          <p>発動条件を複数選んだ場合は、すべての条件を満たしたときだけルールが発動します。</p>
        </div>
      </div>

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
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import ThresholdConditionComment from './ThresholdConditionComment.vue'
  import ThresholdConditionSyoken from './ThresholdConditionSyoken.vue'
  import ThresholdConditionAccess from './ThresholdConditionAccess.vue'
  import ThresholdConditionGift from './ThresholdConditionGift.vue'
  import ThresholdConditionCount from './ThresholdConditionCount.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { Info } from 'lucide-vue-next'

  import { commentThresholdConditionLabels, CommentThresholdCondition, CommentThresholdType } from '@shared/types'
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

  const props = defineProps<{
    modelValue: CommentThresholdType
    selectedRuleId: string | null
  }>()

  // ストアを使用
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
