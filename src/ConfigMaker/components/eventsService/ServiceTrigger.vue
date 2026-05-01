<!-- src/ConfigMaker/components/eventsService/ServiceTrigger.vue -->
<template>
  <!-- 条件タイプ選択（単一選択） -->
  <SettingItem label="適用する発動条件" description="監視するメタデータを選択">
    <div class="flex flex-wrap gap-2">
      <label v-for="(value, key) in serviceTriggerConditionMap" :key="key" class="cursor-pointer">
        <input type="radio" class="hidden" :checked="selectedCondition === key" @change="setCondition(key)" />
        <span class="badge badge-lg select-none" :class="selectedCondition === key ? 'badge-primary' : 'badge-ghost'">
          {{ value }}
        </span>
      </label>
    </div>
  </SettingItem>

  <!-- 高評価条件 -->
  <TriggerMetaCondition
    v-if="selectedCondition === 'upVote'"
    v-model="upVote"
    label="高評価数"
    description="高評価の変化を監視"
    :has-peak="true"
  />

  <!-- 視聴者数条件 -->
  <TriggerMetaCondition
    v-if="selectedCondition === 'viewer'"
    v-model="viewer"
    label="視聴者数"
    description="視聴者数の変化を監視"
    :has-peak="true"
  />

  <!-- 登録者数の場合の説明 -->
  <InformationCard v-if="selectedCondition === 'follower'">
    <p class="leading-relaxed">
      <code class="label bg-accent text-accent-content">登録者数の変化</code><br />
      ・登録者が増えたタイミングで反応します。<br />
      ・わんコメでは API の仕様により「上3桁」しか取得できません。<br />
      ・そのため登録者が 1000 を超える場合は、10単位・100単位で増加したときに反応します。
    </p>
  </InformationCard>

  <!-- 配信経過時間条件 -->
  <SettingItem
    v-if="selectedCondition === 'elapsedMinutes'"
    label="配信経過時間"
    description="配信開始からの経過時間（分）を指定"
  >
    <input
      type="number"
      min="0"
      class="input input-bordered input-sm w-full"
      :value="elapsedMinutes"
      @input="elapsedMinutes = Number(($event.target as HTMLInputElement).value)"
      placeholder="例：30（分）"
    />
  </SettingItem>

  <!-- 登録者数の場合の説明 -->
  <InformationCard v-if="selectedCondition === 'follower' || selectedCondition === 'elapsedMinutes'" variant="warning">
    <p class="leading-relaxed">
      ・この
      <code class="label bg-accent text-accent-content">{{ serviceTriggerConditionMap[selectedCondition] }}</code>
      は現在テスト中の機能です。<br />
      ・今後のバージョンで仕様が変わったり、設定がリセットされる可能性があります。
    </p>
  </InformationCard>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { serviceTriggerConditionMap, ServiceTriggerCondition, ServiceTriggerType } from '@/types'
  import TriggerMetaCondition from './ServiceTriggerCondition.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'

  const props = defineProps<{
    modelValue: ServiceTriggerType
    selectedItemKey: string | null
  }>()

  // Pinia store
  const { updateRecordProperty } = useOmikujiStore()

  // 共通 computed
  const createComputed = <T extends keyof ServiceTriggerType>(key: T) =>
    computed({
      get: () => props.modelValue[key],
      set: (value) => {
        if (!props.selectedItemKey) return
        const updated = { ...props.modelValue, [key]: value }
        updateRecordProperty('metas', props.selectedItemKey, 'trigger', updated)
      },
    })

  // 単一 condition
  const selectedCondition = createComputed('condition')

  // 各条件の値
  const upVote = createComputed('upVote')
  const viewer = createComputed('viewer')
  const elapsedMinutes = createComputed('elapsedMinutes')

  // 単一選択
  const setCondition = (condition: ServiceTriggerCondition) => {
    selectedCondition.value = condition
  }
</script>
