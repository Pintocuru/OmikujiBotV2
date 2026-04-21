<!-- src/MainGenerator/ui/SocialRoster/SocialRoster.vue -->
<template>
  <CenteringWrapper>
    <SocialRosterSelector
      :settings="settings"
      :users="sortedUsers.length ? sortedUsers : generateDummyUserStats(50)"
      :counts="counts"
    />
  </CenteringWrapper>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, toRef } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SocialRosterSchema } from '@/types'
  import { useSocialRosterManager } from './composables/useSocialRosterManager'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
  import SocialRosterSelector from './parts/SocialRosterSelector.vue'
  import { generateDummyUserStats } from '@/common/MockUser/MockGenerators'
  import CenteringWrapper from '@main/ui/common/CenteringWrapper.vue'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const settings = computed(() => data.value.components.settings.socialRoster ?? SocialRosterSchema.parse({}))

  const { isComment } = useVisibilityAccess()

  const { sortedUsers, registerUser, counts } = useSocialRosterManager(toRef(settings.value, 'sortKey'))

  let unsubscribe: (() => void) | null = null

  onMounted(() => {
    if (isComment.value && settings.value.targetEventKey) {
      unsubscribe = appStore.userSession.visits.onVisit(settings.value.targetEventKey, registerUser)
    } else {
      unsubscribe = appStore.userSession.stats.onUpdate(registerUser)
    }
  })

  onUnmounted(() => {
    if (unsubscribe) unsubscribe()
  })
</script>
