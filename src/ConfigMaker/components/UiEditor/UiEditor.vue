<!-- src/ConfigMaker/components/UiEditor/UiEditor.vue -->
<template>
  <!-- アイテム表示設定 -->
  <SectionCard
    v-if="hasAccess(itemSlotEnabled)"
    icon="LayoutGrid"
    :isOpen="true"
    title="アイテム表示設定"
    description="ジェネレーターで表示するアイテムの設定"
  >
    <ComponentConditionsEditor />
  </SectionCard>

  <!-- 各アイテム設定 -->
  <template v-for="(item, type) in uiItemMap" :key="type">
    <SectionCard
      v-if="item.shouldShow"
      :icon="item.icon"
      :isOpen="activeSection === type"
      @toggle="toggleSection(type)"
      :title="item.title"
      :description="item.description"
    >
      <component :is="item.component" />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue'
  import ComponentConditionsEditor from './conditions/ComponentConditionsEditor.vue'

  import { useAccessChecker } from '@config/scripts/useAccessCheckerConfig'
  import { useFlagsSettings } from '@/ConfigMaker/components/appInfo/FlagsSettings/useFlagsSettings'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useUiItemMap } from './useUiItemMap'

  const { uiItemMap } = useUiItemMap()
  const { itemSlotEnabled } = useFlagsSettings()
  const { hasAccess } = useAccessChecker()

  const activeSection = ref<string | null>(null)

  const toggleSection = (section: string) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // 開いた時に最初のアイテムを表示
  watch(
    uiItemMap,
    (map) => {
      if (activeSection.value !== null) return

      const firstKey = Object.entries(map).find(([, item]) => item.shouldShow)?.[0]

      if (firstKey) {
        activeSection.value = firstKey
      }
    },
    { immediate: true }
  )
</script>
