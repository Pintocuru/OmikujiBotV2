<!-- src/configMaker/components/OmikujiItemEditor.vue -->
<template>
  <!-- 左端に色を付ける -->
  <div
    class="card bg-base-100 p-4 border-l-4 mb-4"
    :class="{
      'border-l-primary': index % 2 === 0,
      'border-l-secondary': index % 2 === 1,
    }"
  >
    <div class="space-y-2">
      <!-- OmikujiSetBasic コンポーネント -->
      <OmikujiSetBasic
        :allOmikuji="allOmikujiSets"
        :omikuji="omikujiItem"
        :category="category"
        :selected-rule-id="selectedRuleId"
      />

      <!-- Post Actions Editor コンポーネント -->
      <PostActionsEditor v-model="omikujiItem.postActions" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RuleType } from '@/types/OmikujiData/OmikujiDataSchema'
  import OmikujiSetBasic from './OmikujiSetBasic.vue'
  import PostActionsEditor from '@ConfigComponents/postAction/PostActionsEditor.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'

  const props = defineProps<{
    category: 'comments' | 'timers'
    selectedRuleId: string | null
    index: number // カードの色分け用
  }>()

  // ストアを使用
  const omikujiStore = useOmikujiStore()

  // ストアからデータを取得
  const ruleData = computed(() => {
    if (!props.selectedRuleId) return null
    return omikujiStore.getItem(props.category, props.selectedRuleId) as RuleType | null
  })

  // 全てのおみくじセット
  const allOmikujiSets = computed(() => {
    return ruleData.value?.omikuji || []
  })

  // 現在のインデックスのおみくじアイテム
  const omikujiItem = computed(() => {
    const omikujiSets = allOmikujiSets.value
    return omikujiSets[props.index] || null
  })
</script>
