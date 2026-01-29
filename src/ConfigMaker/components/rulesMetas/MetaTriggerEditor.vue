<!-- src/ConfigMaker/components/rulesMetas/MetaTriggerEditor.vue -->
<template>
  <!-- 条件設定の説明 -->
  <InformationCard>
    <p>
      <code class="label bg-accent text-accent-content">発動条件設定</code>では、
      配信メタデータ（高評価・視聴者数など）の変化を基にルール発動を制御します。
    </p>
    <p>条件が複数ある場合は、すべて満たしたときのみ発動します。(ANDのみ対応)</p>
    <p class="text-xs opacity-70">※ メタデータは3秒ごとに取得・判定されます。</p>
  </InformationCard>

  <!-- 条件タイプ選択 -->
  <SettingItem label="適用する発動条件" description="監視するメタデータを選択">
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
  <!-- 高評価条件 -->
  <TriggerMetaCondition
    v-if="conditions.includes('upVote')"
    v-model="upVote"
    label="高評価数"
    description="高評価の変化を監視"
    :has-peak="true"
  />

  <!-- 視聴者数条件 -->
  <TriggerMetaCondition
    v-if="conditions.includes('viewer')"
    v-model="viewer"
    label="視聴者数"
    description="視聴者数の変化を監視"
    :has-peak="true"
  />

  <!-- 登録者数条件 -->
  <TriggerMetaCondition
    v-if="conditions.includes('follower')"
    v-model="follower"
    label="登録者数・サブスク数"
    description="登録者数の変化を監視（YouTubeは上3桁のみ）"
    :has-peak="false"
  />

  <!-- 配信開始時間条件 -->
  <TriggerMetaCondition
    v-if="conditions.includes('startTime')"
    v-model="startTime"
    label="配信開始時間"
    description="配信開始時刻の変化を監視"
    :has-peak="false"
  />

  <!-- 条件未記入ですべてのメタ更新で適用 -->
  <NoParamsCard v-if="conditions.length === 0" message="すべてのメタデータ更新で適用されます" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'
  import TriggerMetaCondition from './TriggerMetaCondition.vue'
  import { metaTriggerCondition, MetaTriggerCondition, MetaTriggerType } from '@/types/OmikujiProcess/MetaTriggerSchema'

  const props = defineProps<{
    modelValue: MetaTriggerType
    selectedItemKey: string | null
  }>()

  // Pinia store
  const { updateRecordProperty } = useOmikujiStore()

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof MetaTriggerType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedItemKey) return
        const updated = { ...props.modelValue, [key]: value }
        updateRecordProperty('metas', props.selectedItemKey, 'trigger', updated)
      },
    })

  // 各プロパティのcomputed
  const conditions = createComputed('conditions')
  const upVote = createComputed('upVote')
  const viewer = createComputed('viewer')
  const follower = createComputed('follower')
  const startTime = createComputed('startTime')

  // 条件タイプの選択肢
  const conditionTypeLabels: Record<MetaTriggerCondition, string> = {
    upVote: '高評価',
    viewer: '視聴者数',
    follower: '登録者数',
    startTime: '配信開始時間',
  }

  const conditionTypes = computed(() =>
    metaTriggerCondition.map((key) => ({
      value: key,
      label: conditionTypeLabels[key],
    }))
  )

  // Utils
  const toggleInArray = <T,>(array: T[], value: T): T[] => {
    const index = array.indexOf(value)
    return index > -1 ? array.filter((_, i) => i !== index) : [...array, value]
  }

  // Handlers
  const toggleCondition = (condition: MetaTriggerCondition) => {
    conditions.value = toggleInArray(conditions.value, condition)
  }
</script>
