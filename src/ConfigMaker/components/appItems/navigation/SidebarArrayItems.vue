<!-- src/ConfigMaker/components/appItems/navigation/SidebarArrayItems.vue -->
<template>
  <div>
    <SidebarSubItem
      v-for="item in items"
      :key="item.key"
      :category="category"
      :itemKey="item.key"
      :label="item.label"
      :isDragEnabled="false"
      :isSelected="selectedItemKey === item.key"
      :sections="[]"
      @select="navigationStore.selectItem(item.key)"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { CategoryType } from '@/types/OmikujiData/'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import SidebarSubItem from './SidebarSubItem.vue'

  defineProps<{
    category: CategoryType
    items: { key: string; label: string }[]
  }>()

  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)
</script>
