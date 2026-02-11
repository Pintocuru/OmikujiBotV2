<!-- src\MainGenerator\ui\WinnerGroup\WinnerGroup.vue -->
<template>
  <div class="overflow-hidden space-y-4" :data-theme="winnerSetting.color">
    <!-- コンポーネント切り替え -->
    <component :is="currentComponent" :users="selectedUsers" :label="winnerSetting.label" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageExtraType } from '@/types'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import { useAppStore } from '@main/stores/useAppStore'
  import ValentineCoupling from './ValentineCoupling.vue'
  import TopStars from './TopStars.vue'

  // カスタムフック

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

  // コンポーネントマッピング
  const componentMap: Record<string, any> = {
    valentineCoupling: ValentineCoupling,
    TopStars: TopStars,
    // 他のコンポーネントを追加する場合はここに追加
    // anotherComponent: AnotherComponent,
  }

  // 現在選択されているコンポーネント
  const currentComponent = computed(() => {
    const componentKey = winnerSetting.value.component
    return componentMap[componentKey] || ValentineCoupling // フォールバック
  })
</script>
