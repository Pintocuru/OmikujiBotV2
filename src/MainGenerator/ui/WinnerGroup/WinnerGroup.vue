<!-- src\MainGenerator\ui\WinnerGroup\WinnerGroup.vue -->
<template>
  <WinnerGroupRenderer :winnerSetting="winnerSetting" :users="selectedUsers" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@main/stores/useAppStore'
  import WinnerGroupRenderer from './parts/WinnerGroupRenderer.vue'
  import { BotMessageExtraType } from '@/types'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  const winnerSetting = computed(() => data.value.components.settings.winnerGroup)
  const userVisitManager = appStore.userVisitManager

  const winnerExtras = computed<BotMessageExtraType[]>(() =>
    botMessages.value.filter(
      (msg): msg is BotMessageExtraType => msg.type === 'extra' && msg.componentKey === 'WinnerGroup'
    )
  )

  const latestExtra = computed(() => winnerExtras.value.at(-1) ?? null)

  const selectedUserIds = computed<string[]>(() => {
    if (!latestExtra.value?.slots) return []
    return Object.values(latestExtra.value.slots).filter((id): id is string => !!id)
  })

  const selectedUsers = computed<UserVisitRecord[]>(() =>
    selectedUserIds.value.map((id) => userVisitManager.getVisitRecord(id)).filter((r): r is UserVisitRecord => !!r)
  )
</script>
