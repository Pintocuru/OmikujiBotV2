<!-- src\ConfigMaker\components\rules\OmikujiItemEditor.vue -->
<template>
  <!-- 左端に色を付ける -->
  <div
    class="card bg-base-100 p-2 border-x-4 mb-4"
    :class="{
      'border-x-primary': index % 2 === 0,
      'border-x-secondary': index % 2 === 1,
    }"
  >
    <div class="space-y-2">
      <!-- OmikujiItemBasic コンポーネント -->
      <OmikujiItemBasic
        :allOmikuji="allOmikujiSets"
        :omikuji="omikujiItem"
        :category="category"
        :selected-rule-id="selectedRuleId"
      />

      <!-- PostActions編集コンポーネント -->
      <PostActionsEditor v-model="postActions" :category="category" :selected-rule-id="selectedRuleId" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import OmikujiItemBasic from './OmikujiItemBasic.vue'
  import PostActionsEditor from '@ConfigComponents/postAction/PostActionsEditor.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { OmikujiItemType, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType, RuleType } from '@/types/OmikujiData/RulesSchema'

  const props = defineProps<{
    category: RulesCategoryType
    selectedRuleId: string | null
    index: number // カードの色分け用
  }>()

  // Pinia store
  const omikujiStore = useOmikujiStore()

  // Computed
  const allOmikujiSets = computed({
    get: () => {
      if (!props.selectedRuleId) return []
      const record = omikujiStore.getItem(props.category, props.selectedRuleId) as RuleType
      return record?.omikuji || []
    },
    set: (value: OmikujiItemType[]) => {
      if (!props.selectedRuleId) return
      omikujiStore.updateRecordProperty(props.category, props.selectedRuleId, 'omikuji', value)
    },
  })

  // 現在のインデックスのおみくじアイテム
  const omikujiItem = computed(() => {
    const omikujiSets = allOmikujiSets.value
    return omikujiSets[props.index] || null
  })

  // postActionsのgetter/setter
  const postActions = computed({
    get: () => {
      return omikujiItem.value?.postActions || []
    },
    set: (newActions: PostActionType[]) => {
      if (!props.selectedRuleId) return

      const updatedOmikuji = [...allOmikujiSets.value]
      if (updatedOmikuji[props.index]) {
        updatedOmikuji[props.index] = {
          ...updatedOmikuji[props.index],
          postActions: newActions,
        }
        allOmikujiSets.value = updatedOmikuji
      }
    },
  })
</script>
