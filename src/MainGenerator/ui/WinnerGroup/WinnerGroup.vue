<!-- src\MainGenerator\ui\WinnerGroup\WinnerGroup.vue -->
<template>
  <div class="overflow-hidden space-y-4">
    <!-- テスト表示 -->
    <div class="p-4 bg-base-200 rounded-box">
      <h2 class="text-lg font-bold mb-3">Selected Users</h2>

      <div v-if="selectedUsers.length === 0" class="text-sm opacity-60">No users selected</div>

      <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div v-for="user in selectedUsers" :key="user.userId" class="card bg-base-100 shadow">
          <div class="card-body items-center text-center p-4">
            <div class="avatar">
              <div class="w-16 rounded-full">
                <img :src="user.profileImage" alt="avatar" />
              </div>
            </div>
            <div class="font-semibold mt-2">
              {{ user.userName }}
            </div>
            <div class="text-xs opacity-60">Visits: {{ user.visitCount }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageExtraType } from '@/types'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import { useAppStore } from '@main/stores/useAppStore'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  const winnerSetting = computed(() => data.value.components.settings.winnerGroup)
  const userVisitManager = appStore.userVisitManager

  const winnerExtras = computed<BotMessageExtraType[]>(() => {
    return botMessages.value.filter(
      (msg): msg is BotMessageExtraType => msg.type === 'extra' && msg.componentKey === 'WinnerGroup'
    )
  })

  const latestExtra = computed(() => {
    return winnerExtras.value.at(-1) ?? null
  })

  const selectedUserIds = computed<string[]>(() => {
    if (!latestExtra.value?.slots) return []

    return Object.values(latestExtra.value.slots).filter((id): id is string => !!id)
  })

  const selectedUsers = computed<UserVisitRecord[]>(() => {
    return selectedUserIds.value
      .map((userId) => userVisitManager.getVisitRecord(userId))
      .filter((record): record is UserVisitRecord => !!record)
  })
</script>
