<!-- src/ConfigMaker/components/appInfo/FeatureUsageInfo/FeatureUsageInfo.vue -->
<template>
  <div class="space-y-4">
    <!-- 基本機能 -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <SubSectionHeader icon="Package" title="基本機能" description="おみくじBOTの基本的な機能" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FeatureCard
            v-for="(level, key) in usage"
            :key="key"
            :title="categoryMap[key]?.label || key"
            :icon="categoryMap[key]?.icon || 'Package'"
            :access-level="level"
            :description="categoryMap[key]?.description || ''"
            :feature-key="key"
            :show-toggle="true"
            @toggle="handleFeatureToggle"
          />
        </div>

        <!-- どれかがGOD-MODEなら説明をつける -->
        <InformationCard v-if="hasGodModeFeature">
          <p>
            特殊なパッケージのため、
            <code class="label bg-accent text-accent-content">一部の機能は使用できません。</code>
          </p>
        </InformationCard>
      </div>
    </div>

    <!-- アイテム -->
    <div v-if="hasEnabledComponents" class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <SubSectionHeader icon="Box" title="アイテム" description="ジェネレーターで表示できるアイテム" />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <FeatureCard
            v-for="key in components"
            :key="key"
            :title="uiKindMap[key]?.label || key"
            :icon="uiKindMap[key]?.icon || 'Package'"
            access-level="basic"
            :description="uiKindMap[key]?.description || ''"
            :show-toggle="false"
          />
        </div>
        <div v-if="!hasEnabledComponents" class="text-center py-4 text-base-content/60">
          利用可能なアイテムはありません
        </div>
      </div>
    </div>

    <!-- ゲームスクリプト -->
    <div v-if="hasEnabledGames" class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <SubSectionHeader icon="Gamepad2" title="ゲームスクリプト" description="複雑なコードを実行できます" />
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          <FeatureCard
            v-for="key in gameScripts"
            :key="key"
            :title="gameMetaMap[key]?.name || key"
            :icon="gameMetaMap[key]?.icon || 'Package'"
            access-level="basic"
            :description="gameMetaMap[key]?.description || ''"
            :show-toggle="false"
          />
        </div>
        <div v-if="!hasEnabledGames" class="text-center py-4 text-base-content/60">
          利用可能なゲームスクリプトはありません
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { categoryMap, uiKindMap, gameMetaMap } from '@/types/'
  import FeatureCard from './FeatureCard.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import type { AccessLevelType } from '@shared/types'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const usage = computed(() => data.value.featureUsage.usage)
  const components = computed(() => data.value.featureUsage.components)
  const gameScripts = computed(() => data.value.featureUsage.gameScripts)

  const hasEnabledComponents = computed(() => components.value.length > 0)
  const hasEnabledGames = computed(() => gameScripts.value.length > 0)

  const hasGodModeFeature = computed(() => Object.values(usage.value).some((level) => level === 'godMode'))

  const handleFeatureToggle = (key: string, newLevel: AccessLevelType) => {
    omikujiStore.updateNestedFeatureUsage('usage', {
      [key]: newLevel,
    })
  }
</script>
