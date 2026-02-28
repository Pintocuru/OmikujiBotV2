<!-- src/MainGenerator/ui/LiverCounter/LiverCounter.vue -->
<template>
  <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-full">
    <!-- LiverCounterManagerで表示を管理 -->
    <LiverCounterManager :botMessageExtras="rankingMessages" :settings="rankingSettings" />
  </div>
</template>

<script setup lang="ts">
  import { computed, ComputedRef, onMounted, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { BotMessageExtraType, isDev, SettingsLiverCounterSchema } from '@/types/'
  import { useAppStore } from '@main/stores/useAppStore'
  import LiverCounterManager from './parts/LiverCounterManager.vue'

  const appStore = useAppStore()
  const { data, botMessages } = storeToRefs(appStore)

  // 設定を取得
  const rankingSettings = computed(
    () => data.value.components.settings.liverCounter ?? SettingsLiverCounterSchema.parse({})
  )

  // botMessages が更新されたら、値を取得する
  //
  /**
 以下の4つの値を取得
  upVote: number,  viewer: number,  follower: number,  startTime: number | null
  upVote viewer の2つを表示する
  この関数だけは、botMessages のタイミングではなく setTimeout で定期的に取得する
 */
  appStore.metaState.getCurrent()

  // 配信の累計コメント数 (lc)
  appStore.userSession.stats.getLiveComments()

  // 配信の累計コメント数 commenter
  appStore.userSession.stats.getUniqueCount()

  // 初見さんを返す syoken
  appStore.userSession.stats.getSyoken()

  // 配信の累計ギフト金額
  appStore.userSession.stats.getTotalPrice()

  //---

  // eventKey(ruleId) ごとの UserVisitRecord[]
  // visitCount の総数を eventKey の数値として表示する 存在しないなら0
  /**
const UserVisitRecordSchema: z.ZodObject<{
    ruleId: z.ZodString;
    visitCount: z.ZodNumber;
    userName: z.ZodCatch<z.ZodDefault<z.ZodString>>;
    userId: z.ZodDefault<z.ZodString>;
    profileImage: z.ZodDefault<z.ZodString>;
    timestamp: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>
   */
  appStore.userSession.visits.getGroupedByRule()
</script>
