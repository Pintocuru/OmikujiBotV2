<!-- src/MainGenerator/ui/SocialRoster/SocialRoster.vue -->
<template>
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
    <div class="card w-full bg-base-200 mx-auto p-4 space-y-2" :data-theme="settings.color">
      <SocialRosterSelector :settings="settings" :users="sortedUsers" :streamScore="streamScore" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, toRef } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SocialRosterSchema } from '@/types'
  import { useSocialRosterManager } from './composables/useSocialRosterManager'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
  import SocialRosterSelector from './parts/SocialRosterSelector.vue'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const settings = computed(() => data.value.components.settings.socialRoster ?? SocialRosterSchema.parse({}))

  const { isComment } = useVisibilityAccess()

  const { sortedUsers, registerUser, streamScore } = useSocialRosterManager(toRef(settings.value, 'sortKey'))

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
