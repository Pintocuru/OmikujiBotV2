<!-- src/configMaker/components/comments/ThresholdEditor.vue -->
<template>
  <!-- 条件設定の説明 -->
  <InformationCard>
    <p>
      <code class="label bg-accent text-accent-content">発動条件設定</code>では、
      ユーザーのギフト有無やチャット数などを基にルール発動を制御します。
    </p>
    <p>条件が複数ある場合は、すべて満たしたときのみ発動します。(ANDのみ対応)</p>
  </InformationCard>

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
          :checked="conditions.includes(condition.value)"
          @change="toggleCondition(condition.value)"
        />
        <span class="text-sm">{{ condition.label }}</span>
      </label>
    </div>
  </SettingItem>

  <!-- 各条件の詳細設定 -->
  <!-- チャットワード条件 -->
  <ThresholdComment v-if="conditions.includes('comment')" v-model="comment" />

  <!-- 初見条件 -->
  <ThresholdSyoken v-if="conditions.includes('syoken')" v-model="syoken" />

  <!-- アクセスレベル条件 -->
  <TriggerAccess v-if="conditions.includes('access')" v-model="access" />

  <!-- ギフト条件 -->
  <ThresholdGift v-if="conditions.includes('gift')" v-model="gift" />

  <!-- カウント条件 -->
  <TriggerCount v-if="conditions.includes('count')" v-model="count" />

  <!-- ユーザーネーム条件 -->
  <ThresholdUsername v-if="conditions.includes('username')" v-model="userName" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'

  import ThresholdComment from '@shared/components/threshold/ThresholdComment.vue'
  import ThresholdSyoken from '@shared/components/threshold/ThresholdSyoken.vue'
  import ThresholdGift from '@shared/components/threshold/ThresholdGift.vue'
  import ThresholdUsername from '@shared/components/threshold/ThresholdUsername.vue'

  import TriggerAccess from '@shared/components/trigger/TriggerAccess.vue'
  import TriggerCount from '@shared/components/trigger/TriggerCount.vue'

  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import {
    CommentTriggerCondition,
    commentTriggerConditionLabels,
    CommentTriggerType,
  } from '@/types/OmikujiProcess/CommentTriggerSchema'

  const props = defineProps<{
    modelValue: CommentTriggerType
    selectedItemKey: string | null
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof CommentTriggerType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedItemKey) return
        const updated = { ...props.modelValue, [key]: value }
        omikujiStore.updateRecordProperty('comments', props.selectedItemKey, 'trigger', updated)
      },
    })

  // 各プロパティのcomputed
  const conditions = createComputed('conditions')
  const comment = createComputed('comment')
  const syoken = createComputed('syoken')
  const access = createComputed('access')
  const gift = createComputed('gift')
  const count = createComputed('count')
  const userName = createComputed('userName')

  // 条件タイプの選択肢
  const conditionTypes = Object.entries(commentTriggerConditionLabels).map(([value, label]) => ({
    value: value as CommentTriggerCondition,
    label,
  }))

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
