<!-- src\ConfigMaker\components\appInfo\FeatureUsageInfo\FeatureUsageInfo.vue -->
<template>
  <div class="space-y-4">
    <!-- 基本機能 -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <SectionHeader icon="Package" title="基本機能" description="おみくじBOTの基本的な機能" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FeatureCard
            v-for="(level, key) in usage"
            :key="key"
            :title="categoryLabels[key]?.label || key"
            :icon="categoryLabels[key]?.icon || Package"
            :access-level="level"
            :description="categoryLabels[key]?.description || ''"
          />
        </div>
      </div>
    </div>

    <!-- コンポーネント -->
    <div v-if="hasEnabledComponents" class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <SectionHeader icon="Box" title="コンポーネント" description="ジェネレーターで表示できるアイテム" />

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          <ComponentChip v-for="component in enabledComponents" :key="component" :name="component" />
        </div>
        <div v-if="!hasAnyComponents" class="text-center py-4 text-base-content/60">
          利用可能なコンポーネントはありません
        </div>
      </div>
    </div>

    <!-- ゲームスクリプト -->
    <div v-if="hasEnabledGames" class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <SectionHeader icon="Gamepad2" title="ゲームスクリプト" description="複雑なコードを実行できます" />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
          <ComponentChip v-for="game in enabledGames" :key="game" :name="game" is-game />
        </div>
        <div v-if="!hasAnyGames" class="text-center py-4 text-base-content/60">
          利用可能なゲームスクリプトはありません
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import ComponentChip from './ComponentChip.vue'
  import FeatureCard from './FeatureCard.vue'
  import SectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { categoryLabels } from '@/types/OmikujiData/CategoryType'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { hasAccess } from '@/ConfigMaker/scripts/useSettingMode'
  import { Package, Box, Gamepad2 } from 'lucide-vue-next'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const usage = computed(() => data.value.featureUsage.usage)
  const components = computed(() => data.value.featureUsage.components)
  const gameScripts = computed(() => data.value.featureUsage.gameScripts)

  // 有効な機能のみフィルタリング
  const enabledComponents = computed(() => components.value.filter(() => hasAccess('basic')))
  const enabledGames = computed(() => gameScripts.value.filter(() => hasAccess('basic')))

  const hasEnabledComponents = computed(() => components.value.length > 0)
  const hasEnabledGames = computed(() => gameScripts.value.length > 0)
  const hasAnyComponents = computed(() => enabledComponents.value.length > 0)
  const hasAnyGames = computed(() => enabledGames.value.length > 0)
</script>
