<!-- src/ConfigMaker/components/appItems/navigation/SidebarSubItem.vue -->
<template>
  <div>
    <div
      class="group flex items-center gap-1 pl-4 pr-1 rounded hover:bg-neutral hover:text-neutral-content cursor-pointer"
      :class="isSelected ? `bg-${theme} text-${theme}-content` : ''"
      @click="emit('select')"
      @dblclick.stop="emit('item-dblclick', itemKey)"
    >
      <GripVertical
        v-if="draggable && isDragEnabled"
        class="drag-handle w-3 h-3 shrink-0 opacity-0 group-hover:opacity-30 cursor-grab"
      />
      <EyeOff v-if="isEnabled === false" class="w-3 h-3 shrink-0 opacity-40" />
      <span
        class="text-xs py-1 truncate flex-1 min-w-0 select-none"
        :class="[!isSelected ? 'opacity-70' : '', isEnabled === false ? 'line-through' : '']"
      >
        {{ label }}
      </span>
      <slot name="menu" />
    </div>

    <!-- セクションリスト（ダブルクリックで開く） -->
    <div v-if="!isDragEnabled" class="border-l-4 ml-4" :class="`border-${theme}`">
      <SidebarSectionList
        v-if="isSelected && sections.length > 0"
        :category="category"
        :itemKey="itemKey"
        :sections="sections"
        :activeSection="activeSection"
        :theme="theme"
        @selectSection="(section) => (navigationStore.activeSection = section)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { GripVertical, EyeOff } from 'lucide-vue-next'
  import { CategoryType } from '@/types'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useSidebarContext } from './useSidebarContext'
  import { SidebarSectionItem } from './StaticSectionMap'
  import SidebarSectionList from './SidebarSectionList.vue'

  defineProps<{
    category: CategoryType
    itemKey: string
    label: string
    isEnabled?: boolean
    draggable?: boolean
    isDragEnabled: boolean
    isSelected: boolean
    sections: SidebarSectionItem[]
  }>()

  const emit = defineEmits<{
    select: []
    'item-dblclick': [itemKey: string]
  }>()

  const { theme, activeSection } = useSidebarContext()
  const navigationStore = useNavigationStore()
</script>
