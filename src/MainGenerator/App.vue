<!-- src/MainGenerator/App.vue -->
<template>
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
    <MetaDebugPanel v-if="0" />
  </div>

  <!-- わんコメが起動されていない場合のエラー表示 -->
  <ErrorInitComponent v-else-if="appStore.status === 'error'" :pluginUid="null" />
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
  import { useComponentRenderer } from '@main/composables/useComponentRenderer'
  import { useAppInitializer } from '@main/composables/useAppInitializer'
  import { useRuleProcessorLifecycle } from '@main/composables/useRuleProcessorLifecycle'
  import { useFontFamily } from '@/types/'
  import MetaDebugPanel from '@main/ui/MetaDebugPanel.vue'
  import ErrorInitComponent from '@shared/components/error/ErrorInfoDaisy.vue'
  import ConnectionStatusIndicator from '@shared/components/error/ConnectionStatusIndicator.vue'

  const appStore = useAppStore()
  const conditions = computed(() => appStore.data.components.conditions)
  const { isComment, isTimer } = useVisibilityAccess()
  const fontFamily = computed(() => useFontFamily(appStore.data.components.commonStyle.fontFamily ?? 'default'))

  const { activeComponents } = useComponentRenderer(conditions, isComment, isTimer)
  const { initialize } = useAppInitializer(isComment)

  onMounted(initialize)
  useRuleProcessorLifecycle(isTimer)
</script>
