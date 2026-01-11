<!-- src/MainGenerator/components/preview/CounterPreview.vue -->
<template>
  <div class="overflow-hidden">
    <CounterPreviewManager
      :counter-setting="counterSetting"
      :count="count"
      :users="hasPreviewData ? userList : generateDummyUserNames(500)"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import { useAppStore } from '@main/stores/useAppStore'
  import CounterPreviewManager from '@/common/ui/CounterPreview/CounterPreviewManager.vue'
  import { generateDummyUserNames } from '@/common/ui/GameRanking/useDummyBotMessages'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  const counterSetting = computed(() => data.value.components.counter)
  const previewTick = computed(() => botMessages.value.length)
  const userList = ref<UserVisitRecord[]>([])

  const count = computed<number | null>(() => {
    const _ = previewTick.value
    const setting = counterSetting.value
    const ruleKey = setting.ruleKey
    if (!ruleKey) return null

    return setting.target === 'draw'
      ? appStore.userVisitManager.getTotalVisitsByRuleId(ruleKey)
      : appStore.userVisitManager.getVisitsByRuleId(ruleKey).length
  })

  const hasPreviewData = computed(() => {
    return count.value !== null && count.value > 0
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
