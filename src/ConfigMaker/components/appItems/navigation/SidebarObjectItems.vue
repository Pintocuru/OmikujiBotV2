<!-- src/ConfigMaker/components/appItems/navigation/SidebarObjectItems.vue -->
<!--
  appInfo / components 用のセクションリスト。
  theme / activeSection は SidebarSectionList の props として渡す必要があるため
  useSidebarContext() から取得して中継する。
-->
<template>
  <SidebarSectionList
    :category="category"
    :sections="resolvedSections"
    :activeSection="activeSection"
    :theme="theme"
    @selectSection="(section) => (navigationStore.activeSection = section)"
  />
</template>

<script setup lang="ts">
  import { computed, toValue } from 'vue'
  import { CategoryType } from '@/types/OmikujiData/'
  import { useSidebarContext } from './useSidebarContext'
  import { useSidebarSubItems } from './useSidebarSubItems'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import SidebarSectionList from './SidebarSectionList.vue'

  const props = defineProps<{
    category: CategoryType
  }>()

  const { theme, activeSection } = useSidebarContext()
  const { getSections } = useSidebarSubItems()
  const navigationStore = useNavigationStore()

  // getSections は components のときだけ ComputedRef を返す（リアクティブ維持のため）
  // toValue() で ComputedRef / 生配列の両方を透過的に扱う
  const resolvedSections = computed(() => toValue(getSections(props.category)))
</script>
