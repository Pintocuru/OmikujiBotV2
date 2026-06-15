<!-- src/MainGenerator/ui/SocialRoster/SocialRoster.vue -->
<template>
  <CenteringWrapper>
    <SocialRosterSelector :settings="settings" :users="sortedUsers" :counts="counts" />
  </CenteringWrapper>
</template>

<!-- SocialRoster.vue -->
<script setup lang="ts">
  import { computed, onMounted, onUnmounted, toRef } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SocialRosterSchema } from '@/types'
  import { useSocialRosterManager } from './composables/useSocialRosterManager'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
  import SocialRosterSelector from './parts/SocialRosterSelector.vue'
  import CenteringWrapper from '@main/ui/common/CenteringWrapper.vue'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const settings = computed(() => SocialRosterSchema.parse(data.value.components.settings.socialRoster ?? {}))

  const { isComment } = useVisibilityAccess()

  const { sortedUsers, registerUser, clearAll, counts } = useSocialRosterManager(toRef(settings.value, 'sortKey'))

  const unsubscribes: (() => void)[] = []

  onMounted(() => {
    if (isComment.value && settings.value.targetEventKey) {
      // 特定のコメントイベントを購読する場合
      unsubscribes.push(appStore.userSession.visits.onVisit(settings.value.targetEventKey, registerUser))
      unsubscribes.push(appStore.userSession.visits.onReset(clearAll))
    } else {
      // 全イベントを購読する場合
      unsubscribes.push(appStore.userSession.stats.onUpdate(registerUser))
      unsubscribes.push(appStore.userSession.stats.onReset(clearAll))
    }
  })

  onUnmounted(() => {
    unsubscribes.forEach((fn) => fn())
  })
</script>
