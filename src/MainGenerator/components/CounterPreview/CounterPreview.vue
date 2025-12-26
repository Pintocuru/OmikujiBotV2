<!-- src/MainGenerator/components/preview/CounterPreview.vue -->
<template>
  <CounterPreviewCard :counter-setting="counterSetting" :count="count" :users="userList" />
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import CounterPreviewCard from './CounterPreviewCard.vue'
  import { useAppStore } from '@/MainGenerator/stores/useAppStore'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  const counterSetting = computed(() => data.value.components.counter)
  const previewTick = computed(() => botMessages.value.length)
  const userList = ref<string[]>([])

  const count = computed(() => {
    const _ = previewTick.value
    const setting = counterSetting.value
    const ruleKey = setting.ruleKey
    if (!ruleKey) return '-'

    const current =
      setting.target === 'draw'
        ? appStore.userVisitManager.getTotalVisitsByRuleId(ruleKey)
        : appStore.userVisitManager.getVisitsByRuleId(ruleKey).length

    return setting.isDirectionUp ? setting.firstValue + current : Math.max(0, setting.firstValue - current)
  })

  const lastUserName = computed(() => {
    const _ = previewTick.value
    const setting = counterSetting.value
    const ruleKey = setting.ruleKey
    if (!ruleKey) return ''

    const current = appStore.userVisitManager.getLatestVisitorByRuleId(ruleKey)

    return current?.name ?? ''
  })

  watch(
    () => lastUserName.value,
    (name: string) => {
      if (!name || name === '') return
      if (userList.value.some((n) => n === name)) return
      userList.value.push(name)
    }
  )
</script>
