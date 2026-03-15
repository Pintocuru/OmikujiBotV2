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
  import { useComponentRenderer } from '@main/composables/useComponentRenderer'
  import { useAppInitializer } from '@main/composables/useAppInitializer'
  import { useRuleProcessor } from '@main/composables/useRuleProcessor'
  import { useAppStore } from '@main/stores/useAppStore'
  import MetaDebugPanel from '@main/ui/MetaDebugPanel.vue'
  import ErrorInitComponent from '@shared/components/error/ErrorInfoDaisy.vue'
  import ConnectionStatusIndicator from '@shared/components/error/ConnectionStatusIndicator.vue'

  const appStore = useAppStore()
  const fontFamily = computed(() => useFontFamily(appStore.data.components.commonStyle.fontFamily ?? 'default'))

  // コンポーネント設定
  const { activeComponents } = useComponentRenderer()
  // 初期化処理
  const { initialize } = useAppInitializer()

  onMounted(initialize)
  useRuleProcessor()
</script>
