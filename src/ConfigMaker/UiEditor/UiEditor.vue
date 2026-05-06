<!-- src/ConfigMaker/UiEditor/UiEditor.vue -->
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
    v-if="hasAccess(itemSlotEnabled) && (isDev || isGod || !specialSet)"
    id="section-itemConditions"
    icon="LayoutGrid"
    :isOpen="activeSection === 'itemConditions'"
    @toggle="toggleSection('itemConditions')"
    title="アイテム表示設定"
    description="ジェネレーターで表示するアイテムの設定"
  >
    <!-- isGod のときのみスペシャルセット切り替えを表示 -->
    <SpecialSetEditor v-if="isGod || isDev" />

    <!-- specialSet未設定時のみ個別スロット設定を表示 -->
    <ItemConditionsEditor v-if="!specialSet" />
  </SectionCard>

  <!-- 各アイテム設定 -->
  <template v-for="[type, item] in visibleItems" :key="type">
    <SectionCard
      :id="`section-${type}`"
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
  import { computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { uiItemMap, VisibilityKey } from './useUiItemMap'
  import ItemConditionsEditor from './conditions/ItemConditionsEditor.vue'
  import ItemsSettings from './conditions/ItemsSettings.vue'
  import { useAccessChecker, useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useFlagsSettings } from '@config/components/appInfo/FlagsSettings/useFlagsSettings'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import SpecialSetEditor from './conditions/SpecialSetEditor.vue'
  import { useUiVisibility } from './conditions/useUiVisibility'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { isDev } from '@/types'
  import { useOmikujiStore } from '../stores/useOmikujiStore'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const specialSet = computed(() => data.value.components.specialSet)

  const { itemSlotEnabled } = useFlagsSettings()
  const { hasAccess } = useAccessChecker()
  const { isGod } = useSettingMode()

  // navigationStore.activeSection を共用
  // サイドバーのセクション項目クリックと UiEditor のトグルが同一 ref を参照する
  const navigationStore = useNavigationStore()
  const { activeSection } = storeToRefs(navigationStore)

  const { visibilityMap, hasComponentKind } = useUiVisibility()

  const visibleItems = computed(() =>
    Object.entries(uiItemMap).filter(([_kind, item]) => {
      if (item.targetKey && !hasComponentKind(item.targetKey)) return false
      return item.visibility.every((v) => {
        if (v.startsWith('!')) {
          const key = v.slice(1) as VisibilityKey
          return !visibilityMap.value[key]
        }
        return visibilityMap.value[v]
      })
    })
  )

  const toggleSection = (section: string) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // 開いた時に最初のアイテムを表示（activeSection が未設定のときのみ）
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
