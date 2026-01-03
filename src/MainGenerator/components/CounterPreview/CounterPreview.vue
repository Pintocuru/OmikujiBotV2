<!-- src/MainGenerator/components/preview/CounterPreview.vue -->
<template>
  <CounterPreviewCard :counter-setting="counterSetting" :count="count" :users="userList" />
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import CounterPreviewCard from './CounterPreviewCard.vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  const counterSetting = computed(() => data.value.components.counter)
  const previewTick = computed(() => botMessages.value.length)
  const userList = ref<UserVisitRecord[]>([])

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

  const lastUserName = computed<UserVisitRecord | null>(() => {
    const _ = previewTick.value
    const ruleKey = counterSetting.value.ruleKey
    if (!ruleKey) return null

    return appStore.userVisitManager.getLatestVisitorByRuleId(ruleKey)
  })

  watch(
    () => lastUserName.value,
    (data: UserVisitRecord | null) => {
      if (!data) return
      if (userList.value.includes(data)) return
      userList.value.push(data)
    }
  )
</script>
