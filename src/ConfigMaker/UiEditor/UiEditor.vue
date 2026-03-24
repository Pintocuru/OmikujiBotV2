<!-- src/ConfigMaker/components/UiEditor/UiEditor.vue -->
<template>
  <!-- GOD: アイテム有効/無効トグル -->
  <SectionCard
    v-if="isGod || isDev"
    variant="warning"
    icon="LayoutGrid"
    title="アイテム有効・無効切り替え"
    description="消し忘れがないかチェックしたか？"
  >
    <ItemsSettings />
  </SectionCard>

  <!-- アイテム表示設定 -->
  <SectionCard
    v-if="hasAccess(itemSlotEnabled)"
    icon="LayoutGrid"
    :isOpen="true"
    title="アイテム表示設定"
    description="ジェネレーターで表示するアイテムの設定"
  >
    <ItemConditionsEditor />
  </SectionCard>

  <!-- 各アイテム設定 -->
  <template v-for="[type, item] in visibleItems" :key="type">
    <SectionCard
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
  import { computed, ref, watch } from 'vue'
  import { uiItemMap, VisibilityKey } from './useUiItemMap'
  import ItemConditionsEditor from './conditions/ItemConditionsEditor.vue'
  import ItemsSettings from './conditions/ItemsSettings.vue'
  import { useAccessChecker, useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useFlagsSettings } from '@/ConfigMaker/components/appInfo/FlagsSettings/useFlagsSettings'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useUiVisibility } from './conditions/useUiVisibility'
  import { isDev } from '@/types'

  const { itemSlotEnabled } = useFlagsSettings()
  const { hasAccess } = useAccessChecker()
  const { isGod } = useSettingMode()
  const activeSection = ref<string | null>(null)

  const { visibilityMap, hasComponentKind } = useUiVisibility()

  const visibleItems = computed(() =>
    Object.entries(uiItemMap).filter(([_kind, item]) => {
      // 1. slot選択条件
      if (item.targetKey && !hasComponentKind(item.targetKey)) return false

      // 2. visibility条件（すべて満たす必要あり）
      return item.visibility.every((v) => {
        // "!" で始まる場合は否定として評価
        if (v.startsWith('!')) {
          const key = v.slice(1) as VisibilityKey
          return !visibilityMap.value[key]
        }
        // 通常の評価
        return visibilityMap.value[v]
      })
    })
  )

  const toggleSection = (section: string) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // 開いた時に最初のアイテムを表示
  watch(
    visibleItems,
    (items) => {
      if (activeSection.value !== null) return

      const first = items[0]?.[0]
      if (first) activeSection.value = first
    },
    { immediate: true }
  )
</script>
