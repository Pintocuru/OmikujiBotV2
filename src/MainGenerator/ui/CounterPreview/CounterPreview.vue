<!-- src/MainGenerator/ui/CounterPreview/CounterPreview.vue -->
<template>
  <CenteringWrapper>
    <CounterPreviewSelector
      :counter-setting="counterSetting"
      :count="count"
      :users="hasPreviewData ? userList : generateDummyVisitRecords(500)"
    />
  </CenteringWrapper>
</template>

<script setup lang="ts">
  import { computed, ref, watchEffect } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CounterPreviewSchema } from '@/types'
  import CounterPreviewSelector from './parts/CounterPreviewSelector.vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@/MainGenerator/scripts/FeatureAccess/useAccessCheckerMain'
  import { generateDummyVisitRecords } from '@/common/MockUser/MockGenerators'
  import { UserNameType } from '@shared/types'
  import CenteringWrapper from '@main/ui/common/CenteringWrapper.vue'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)
  const { isComment } = useVisibilityAccess()

  const counterSetting = computed(() => data.value.components.settings.counter ?? CounterPreviewSchema.parse({}))

  // トリガー専用（依存まとめ）
  const tick = computed(() => botMessages.value.length)

  // 共通キー
  const effectiveRuleKey = computed(() => counterSetting.value.targetEventKey ?? '')

  // 共通フラグ
  const isRuleActive = computed(() => effectiveRuleKey.value && isComment.value)

  const count = computed<number>(() => {
    const _ = tick.value
    const { target } = counterSetting.value

    if (!isRuleActive.value) {
      return target === 'draw'
        ? appStore.streamStats.getStats().liveComments
        : appStore.userSession.stats.getUniqueCount()
    }

    return target === 'draw'
      ? appStore.userSession.visits.getTotal(effectiveRuleKey.value)
      : appStore.userSession.visits.getUniqueCount(effectiveRuleKey.value)
  })

  const lastUserName = computed<UserNameType | null>(() => {
    const _ = tick.value
    if (!isRuleActive.value) return appStore.userSession.stats.getLatest()

    return appStore.userSession.visits.getLatest(effectiveRuleKey.value)
  })

  const userList = ref<UserNameType[]>([])

  watchEffect(() => {
    const user = lastUserName.value
    if (user && !userList.value.includes(user)) {
      userList.value.push(user)
    }
  })

  const hasPreviewData = computed(() => count.value > 0)
</script>
