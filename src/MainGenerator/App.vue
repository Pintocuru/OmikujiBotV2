<!-- src/MainGenerator/App.vue -->
<template>
  <div v-if="appStore.isInitialized" class="h-screen overflow-hidden" :class="[fontClass]" data-theme="transparent">
    <!-- 動的コンポーネント表示 -->
    <template v-for="item in activeComponents" :key="item?.slot">
      <component v-if="item" :is="item.component" :class="item.classes" v-bind="item.props" />
    </template>

    <!-- meta -->
    <MetaDebugPanel v-if="0" />
  </div>

  <!-- わんコメが起動されていない場合のエラー表示 -->
  <ErrorInitComponent v-else :pluginUid="null" />
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import { useAppStore } from '@main/stores/useAppStore'
  import { useVisibilityAccess } from '@main/scripts/FeatureAccess/useAccessCheckerMain'
  import { useComponentRenderer } from '@main/composables/useComponentRenderer'
  import { useAppInitializer } from '@main/composables/useAppInitializer'
  import { useRuleProcessorLifecycle } from '@main/composables/useRuleProcessorLifecycle'
  import { useFontFamily } from '@/types/MainGenerator/useFontFamily'
  import MetaDebugPanel from '@main/ui/MetaDebugPanel.vue'
  import ErrorInitComponent from '@shared/components/error/ErrorInfo.vue'

  const appStore = useAppStore()
  const conditions = computed(() => appStore.data.components.conditions)
  const { isComment, isTimer } = useVisibilityAccess()
  const fontClass = computed(() => useFontFamily(appStore.data.components.commonStyle.fontFamily ?? 'default'))

  const { activeComponents } = useComponentRenderer(conditions, isComment, isTimer)
  const { initialize } = useAppInitializer(isComment)

  onMounted(initialize)
  useRuleProcessorLifecycle(isTimer)
</script>
