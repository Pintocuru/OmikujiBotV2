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
  import CounterPreviewManager from './parts/CounterPreviewManager.vue'
  import { generateDummyUserNames } from '@main/ui/GameRanking/parts/useDummyBotMessages'
  import { SettingsCounterSchema } from '@/types'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  const counterSetting = computed(() => data.value.components.settings.counter ?? SettingsCounterSchema.parse({}))
  const previewTick = computed(() => botMessages.value.length)
  const userList = ref<UserVisitRecord[]>([])

  const count = computed<number | null>(() => {
    const _ = previewTick.value
    const { ruleKey, target } = counterSetting.value
    const effectiveRuleKey = ruleKey ?? ''

    return target === 'draw'
      ? appStore.userSession.visits.getTotalByRuleId(effectiveRuleKey)
      : appStore.userSession.visits.getByRuleId(effectiveRuleKey).length
  })

  const hasPreviewData = computed(() => !!count.value && count.value > 0)

  const lastUserName = computed<UserVisitRecord | null>(() => {
    const _ = previewTick.value
    const effectiveRuleKey = counterSetting.value.ruleKey ?? ''
    return appStore.userSession.visits.getLatestByRuleId(effectiveRuleKey)
  })

  watch(lastUserName, (data: UserVisitRecord | null) => {
    if (!data || userList.value.includes(data)) return
    userList.value.push(data)
  })
</script>
