<!-- src/MainGenerator/App.vue -->
<template>
  <div class="bg-base-100 transparent-bg overflow-hidden">
    <!-- 接続状態インジケーター（全状態で常時マウント） -->
    <ConnectionStatusIndicator :status="appStore.status" />

    <!-- 初期化完了後のメイン表示 -->
    <div
      v-if="appStore.status === 'ready'"
      class="h-screen overflow-hidden"
      :class="[fontFamily]"
      data-theme="transparent"
    >
      <!-- 動的コンポーネント表示 -->
      <template v-for="item in activeComponents" :key="item?.slot">
        <component v-if="item" :is="item.component" />
      </template>

      <!-- meta -->
      <MetaDebugPanel v-if="isDev && 0" />
    </div>

    <!-- わんコメが起動されていない場合のエラー表示 -->
    <ErrorInitComponent v-else-if="appStore.status === 'error'" />
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { isDev, useFontFamily } from '@/types/'
  import { useAppInitializer } from '@main/composables/useAppInitializer'
  import { useRuleProcessor } from '@main/composables/useRuleProcessor'
  import { useAppStore } from '@main/stores/useAppStore'
  import MetaDebugPanel from '@main/ui/MetaDebugPanel.vue'
  import ErrorInitComponent from '@shared/components/error/ErrorInfoDaisy.vue'
  import ConnectionStatusIndicator from '@shared/components/error/ConnectionStatusIndicator.vue'
  import { COMPONENT_MAP } from './ui/ComponentMaps'

  const appStore = useAppStore()
  const fontFamily = computed(() => useFontFamily(appStore.data.components.commonStyle.fontFamily ?? 'default'))

  // コンポーネント設定
  const SLOT_PRIORITY = { primary: 2, secondary: 2, extra: 1 } as const
  const activeComponents = computed(() => {
    return appStore.data.components.conditions
      .map((condition) => ({
        slot: condition.slot,
        component: COMPONENT_MAP[condition.kind],
      }))
      .sort((a, b) => SLOT_PRIORITY[b.slot] - SLOT_PRIORITY[a.slot])
  })

  // 初期化処理
  const { initialize } = useAppInitializer()
  onMounted(initialize)
  useRuleProcessor()
</script>
