<!-- src/ConfigMaker/components/appInfo/FlagsInfo/FlagsInfo.vue -->
<template>
  <div class="space-y-4">
    <!-- 基本機能 -->
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <SubSectionHeader icon="Package" title="基本機能" description="おみくじBOTの基本的な機能" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <template v-for="(level, key) in usage" :key="key">
            <!-- isPro=false かつ none は非表示 -->
            <FeatureCard
              v-if="isPro || level !== 'none'"
              :title="categoryMap[key]?.label || key"
              :icon="categoryMap[key]?.icon || 'Package'"
              :access-level="level"
              :description="categoryMap[key]?.description || ''"
              :feature-key="key"
              :show-toggle="isPro"
              @toggle="handleFeatureToggle"
            />
          </template>
        </div>
        <div v-if="!hasVisibleUsage" class="text-center py-4 text-base-content/60">利用可能な機能はありません</div>
      </div>
    </div>

    <!-- アイテム -->
    <div class="card bg-base-100 shadow-lg" v-if="hasEnabledComponents || isPro">
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
    <div class="card bg-base-100 shadow-lg" v-if="hasEnabledGames || isPro">
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
  import { categoryMap, uiKindMap, gameMetaMap, UiKind } from '@/types'
  import FeatureCard from './FeatureCard.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import type { AccessLevelType } from '@shared/types'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const usage = computed(() => data.value.featureUsage.usage)
  const settings = computed(() => data.value.components.settings)
  const components = computed(() =>
    (Object.keys(settings.value) as UiKind[]).filter(
      (key) => settings.value[key as keyof typeof settings.value] !== undefined
    )
  )
  const gameScripts = computed(() => data.value.featureUsage.gameScripts)

  const { isPro } = useSettingMode()

  const hasEnabledComponents = computed(() => components.value.length > 0)
  const hasEnabledGames = computed(() => gameScripts.value.length > 0)

  // isPro=false のとき none 以外のものがあるか
  const hasVisibleUsage = computed(() => {
    if (isPro.value) return true
    return Object.values(usage.value).some((level) => level !== 'none')
  })

  const handleFeatureToggle = (key: string, newLevel: AccessLevelType) => {
    if (!isPro.value) return
    omikujiStore.updateFlagsNested('usage', { [key]: newLevel })
  }
</script>
