<!-- src/MainGenerator/ui/SocialRoster/SocialRoster.vue -->
<template>
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
    <div class="card w-full bg-base-200 mx-auto p-4 space-y-2" :data-theme="settings.color">
      <h2 v-if="settings.label" class="text-xl font-bold text-center">
        {{ settings.label }}
      </h2>

      <SocialRosterSelector
        :users="sortedUsers"
        :component="settings.component"
        :cellSize="settings.cellSize"
        :statKey="settings.statKey"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { storeToRefs } from 'pinia'
  import { SettingsSocialSchema } from '@/types'
  import { useSocialRosterManager } from './composables/useSocialRosterManager'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
  import SocialRosterSelector from './parts/SocialRosterSelector.vue'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)
  const settings = computed(() => data.value.components.settings.socialRoster ?? SettingsSocialSchema.parse({}))

  const { isComment } = useVisibilityAccess()

  const { sortedUsers, registerUser } = useSocialRosterManager({
    sortKey: computed(() => settings.value.sortKey),
    sortOrder: computed(() => settings.value.sortOrder),
  })

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
