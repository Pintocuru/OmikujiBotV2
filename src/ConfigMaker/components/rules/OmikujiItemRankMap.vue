<!-- src\ConfigMaker\components\rules\OmikujiItemRankMap.vue -->
<template>
  <div v-if="selectedRuleId">
    <!-- rankMapEnabled -->
    <InformationCard v-if="rankMapEnabled" class="mb-4">
      <p><code class="label bg-accent text-accent-content">ゲームスクリプト</code>\{\{rank}} が使用可能になります</p>
    </InformationCard>

    <!-- 有効・無効の切り替えボタン -->
    <SettingItem label="ランキングを有効にする" description="動的プレースホルダー{{rank}}が使用可能になります">
      <input type="checkbox" v-model="rankMapEnabled" class="toggle toggle-primary" />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RulesCategoryType, RuleType } from '@/types/OmikujiData/RulesSchema'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import InformationCard from '@ConfigComponents/parts/InformationCard.vue'

  const props = defineProps<{
    category: RulesCategoryType
    selectedRuleId: string | null
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // 各プロパティのcomputed getter/setter
  const createComputed = <T extends keyof RuleType>(key: T) =>
    computed<RuleType[T]>({
      get: () => {
        if (!props.selectedRuleId) return undefined as RuleType[T]
        const record = omikujiStore.getItem(props.category, props.selectedRuleId) as RuleType
        return record?.[key]
      },
      set: (value) => {
        if (!props.selectedRuleId) return
        omikujiStore.updateRecordProperty(props.category, props.selectedRuleId, key, value)
      },
    })

  const rankMapEnabled = createComputed('rankMapEnabled')
</script>
