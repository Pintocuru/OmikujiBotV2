<!-- src/MainGenerator/ui/CounterPreview/CounterPreview.vue -->
<template>
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
    <div class="overflow-hidden">
      <CounterPreviewManager
        :counter-setting="counterSetting"
        :count="count"
        :users="hasPreviewData ? userList : generateDummyVisitRecords(500)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import { useAppStore } from '@main/stores/useAppStore'
  import CounterPreviewManager from './parts/CounterPreviewManager.vue'
  import { generateDummyVisitRecords } from '@/MainGenerator/ui/GameRanking/parts/dummyGenerators'
  import { SettingsCounterSchema } from '@/types'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  const counterSetting = computed(() => data.value.components.settings.counter ?? SettingsCounterSchema.parse({}))
  const previewTick = computed(() => botMessages.value.length)
  const userList = ref<UserVisitRecord[]>([])

  const count = computed<number | null>(() => {
    const _ = previewTick.value
    const { targetEventKey: ruleKey, target } = counterSetting.value
    const effectiveRuleKey = ruleKey ?? ''

    return target === 'draw'
      ? appStore.userSession.visits.getTotalByRuleId(effectiveRuleKey)
      : appStore.userSession.visits.getByRuleId(effectiveRuleKey).length
  })

  const hasPreviewData = computed(() => !!count.value && count.value > 0)

  const lastUserName = computed<UserVisitRecord | null>(() => {
    const _ = previewTick.value
    const effectiveRuleKey = counterSetting.value.targetEventKey ?? ''
    return appStore.userSession.visits.getLatestByRuleId(effectiveRuleKey)
  })

  watch(lastUserName, (data: UserVisitRecord | null) => {
    if (!data || userList.value.includes(data)) return
    userList.value.push(data)
  })
</script>
