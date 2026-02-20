<!-- src/MainGenerator/ui/WinnerGroup/WinnerGroup.vue -->
<template>
  <div class="relative">
    <!-- 履歴ボタン -->
    <HistoryButton :history-items="historyItems" :color="winnerSetting.color" @clear="clearHistory" />

    <!-- メイン表示 -->
    <WinnerGroupRenderer
      :key="previewKey"
      :winner-setting="winnerSetting"
      :users="selectedUsers"
      :is-visible="isVisible"
      @click="handleClick"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted, ref, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageExtraType, SettingsWinnerGroupSchema, UserStatsRecord } from '@/types'
  import WinnerGroupRenderer from './parts/WinnerGroupRenderer.vue'
  import HistoryButton from './components/HistoryButton.vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import { PostOmikujiService } from '@main/scripts/PostOmikuji/PostOmikujiService'
  import { UserNameType } from '@shared/types'

  interface HistoryItem {
    id: string
    timestamp: string
    users: UserNameType[]
  }

  const TIMER = 30000

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)
  const previewKey = ref(0)
  const historyItems = ref<HistoryItem[]>([])
  const isVisible = ref(true)
  const hideTimer = ref<number | null>(null)

  const winnerSetting = computed(
    () => data.value.components.settings.winnerGroup ?? SettingsWinnerGroupSchema.parse({})
  )
  const winnerExtras = computed<BotMessageExtraType[]>(() =>
    botMessages.value.filter(
      (msg): msg is BotMessageExtraType => msg.type === 'extra' && msg.componentKey === 'WinnerGroup'
    )
  )
  const latestExtra = computed(() => winnerExtras.value.at(-1) ?? null)
  const ruleKey = computed(() => winnerSetting.value.ruleKey)

  const selectedUserIds = computed<string[]>(() => {
    if (!latestExtra.value?.slots) return []
    return Object.values(latestExtra.value.slots).filter((id): id is string => !!id)
  })

  const selectedUsers = computed<UserNameType[]>(() =>
    selectedUserIds.value.map((id) => appStore.userSession.stats.get(id)).filter((r): r is UserStatsRecord => !!r)
  )

  // 30秒後に非表示にする
  const startHideTimer = () => {
    // 既存のタイマーをクリア
    if (hideTimer.value !== null) {
      clearTimeout(hideTimer.value)
    }

    // 表示状態をリセット
    isVisible.value = true

    // 30秒後に非表示
    hideTimer.value = window.setTimeout(() => {
      isVisible.value = false
      hideTimer.value = null
    }, TIMER)
  }

  // 履歴に追加
  const addToHistory = (users: UserNameType[]) => {
    if (users.length === 0) return

    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: new Date().toISOString(),
      users: [...users], // 配列のコピーを保存
    }

    // 最新を先頭に追加し、10件に制限
    historyItems.value = [newItem, ...historyItems.value].slice(0, 10)
  }

  const clearHistory = () => {
    historyItems.value = []
  }

  const handleClick = () => {
    previewKey.value++

    // WinnerGroup の実行
    const result = appStore.scriptManager.playScript({
      scriptId: 'WinnerGroup',
      queryString: winnerSetting.value.queryString,
      characterKey: null,
    })
    if (!result?.botMessageExtras?.length) return
    result.botMessageExtras.forEach((extra) => {
      appStore.addBotMessage(extra)
    })

    // 対象のユーザーがいないなら稼働しない
    const visits = appStore.userSession.visits.getByRuleId(ruleKey.value)
    if (visits.length === 0) return

    // わんコメにpost
    if (!result?.actions) return
    const postMessage = new PostOmikujiService(data.value)
    postMessage.post(result.actions)

    // 30秒タイマーを開始
    startHideTimer()
  }

  // selectedUsersが変更されたら履歴に追加
  watch(selectedUsers, (newUsers) => {
    if (newUsers.length > 0) {
      addToHistory(newUsers)
    }
  })

  // 初回実行
  onMounted(() => handleClick())
</script>
