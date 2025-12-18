<!-- src\ConfigMaker\components\rules\OmikujiItemBasic.vue -->
<template>
  <div class="space-y-4">
    <!-- 優先度と重み -->
    <OmikujiItemIsPriority
      :allOmikuji="allOmikuji"
      :omikuji="omikuji"
      :category="category"
      :selectedItemKey="selectedItemKey"
    />

    <!-- 発動条件 -->
    <OmikujiItemConditions
      :allOmikuji="allOmikuji"
      :omikuji="omikuji"
      :category="category"
      :selectedItemKey="selectedItemKey"
    />
  </div>
</template>

<script setup lang="ts">
  import { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'
  import { RulesCategoryType } from '@/types/OmikujiData/RulesSchema'
  import OmikujiItemIsPriority from './OmikujiItemIsPriority.vue'
  import OmikujiItemConditions from './OmikujiItemCriteria.vue'

  const props = defineProps<{
    allOmikuji: OmikujiItemType[]
    omikuji: OmikujiItemType
    category: RulesCategoryType
    selectedItemKey: string | null
  }>()
</script>
