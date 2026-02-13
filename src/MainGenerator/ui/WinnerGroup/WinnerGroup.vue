<!-- src\MainGenerator\ui\WinnerGroup\WinnerGroup.vue -->
<template>
  <WinnerGroupRenderer :key="previewKey" :winnerSetting="winnerSetting" :users="selectedUsers" @click="handleClick" />
</template>

<script setup lang="ts">
  import { computed, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageExtraType, SettingsWinnerGroupSchema } from '@/types'
  import { UserVisitRecord } from '@/types/MainGenerator/UserVisits'
  import WinnerGroupRenderer from './parts/WinnerGroupRenderer.vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import { PostOmikujiService } from '@/MainGenerator/scripts/PostOmikuji/PostOmikujiService'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)
  const previewKey = ref(0)

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

  const selectedUsers = computed<UserVisitRecord[]>(() =>
    selectedUserIds.value
      .map((id) => appStore.userVisitManager.getVisitRecord(id))
      .filter((r): r is UserVisitRecord => !!r)
  )

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
    const visits = appStore.userVisitManager.getVisitsByRuleId(ruleKey.value)
    if (visits.length === 0) return

    // わんコメにpost
    if (!result?.actions) return
    const postMessage = new PostOmikujiService(data.value)
    postMessage.post(result.actions)
  }

  // 初回実行
  onMounted(() => handleClick())
</script>
