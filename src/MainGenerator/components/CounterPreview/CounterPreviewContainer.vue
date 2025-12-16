<!-- src/MainGenerator/components/preview/CounterPreviewContainer.vue -->
<template>
  <CounterPreviewCard :counter="previewCounter" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import CounterPreviewCard from './CounterPreviewCard.vue'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const counter = computed(() => data.value.displaySettings.components.counter)

  const previewCounter = computed(() => {
    const ruleKey = counter.value.ruleKey
    let value = counter.value.firstValue

    if (!ruleKey) {
      return {
        ...counter.value,
        firstValue: value,
      }
    }

    if (counter.value.target === 'draw') {
      value = appStore.cooldownManager.getTotalDrawsByRuleId(ruleKey)
    } else {
      value = appStore.cooldownManager.getDrawCountsStatusByRuleId(ruleKey).length
    }

    return {
      ...counter.value,
      firstValue: counter.value.isDirectionUp ? value : Math.max(0, counter.value.firstValue - value),
    }
  })
</script>
