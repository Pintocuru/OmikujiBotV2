<template>
  <div
    class="group flex items-center gap-1 pl-4 pr-1 rounded hover:bg-base-300 cursor-pointer"
    :class="isSelected ? `bg-${theme} text-${theme}-content` : ''"
    @click="emit('select')"
    @dblclick.stop="emit('item-dblclick', itemKey)"
  >
    <GripVertical
      v-if="draggable && !isDragDisabled"
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

  <div v-if="isDragDisabled" class="border-l-4 ml-4" :class="`border-${theme}`">
    <SidebarSectionList
      v-if="isSelected && sections.length > 0"
      :category="category"
      :itemKey="itemKey"
      :sections="sections"
      :activeSection="activeSection"
      :theme="theme"
      @selectSection="(section) => emit('selectSection', section)"
    />
  </div>
</template>

<script setup lang="ts">
  import { GripVertical, EyeOff } from 'lucide-vue-next'
  import SidebarSectionList from './SidebarSectionList.vue'
  import { SidebarSectionItem } from './StaticSectionMap'
  import { CategoryType } from '@/types'

  defineProps<{
    category: CategoryType
    itemKey: string
    label: string
    isEnabled?: boolean
    isSelected: boolean
    draggable?: boolean
    theme: string
    sections: SidebarSectionItem[]
    isDragDisabled: boolean
    activeSection: string | null
  }>()

  const emit = defineEmits<{
    select: []
    selectSection: [section: string]
    'item-dblclick': [itemKey: string]
  }>()
</script>
