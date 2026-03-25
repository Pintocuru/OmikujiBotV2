<!-- src/ConfigMaker/components/appItems/navigation/SidebarSubItem.vue -->
<template>
  <!-- アイテム行 -->
  <div
    class="group flex items-center gap-1 pl-4 pr-1 rounded hover:bg-base-300 cursor-pointer"
    :class="isSelected ? `bg-${theme} text-${theme}-content` : ''"
    @click="emit('select')"
  >
    <!-- ドラッグハンドル -->
    <GripVertical v-if="draggable" class="drag-handle w-3 h-3 shrink-0 opacity-0 group-hover:opacity-30 cursor-grab" />
    <!-- 無効アイコン -->
    <EyeOff v-if="isEnabled === false" class="w-3 h-3 shrink-0 opacity-40" />
    <!-- ラベル -->
    <span
      class="text-xs py-1 truncate flex-1 min-w-0"
      :class="[!isSelected ? 'opacity-70' : '', isEnabled === false ? 'line-through' : '']"
    >
      {{ label }}
    </span>
    <!-- メニュースロット（Record カテゴリのみ） -->
    <slot name="menu" />
  </div>

  <!-- セクション項目（選択中のアイテムにのみ表示） -->
  <template v-if="isSelected && sections.length > 0">
    <button
      v-for="sec in sections"
      :key="sec.section"
      class="w-full flex items-center gap-1.5 pl-8 pr-2 py-0.5 text-xs rounded hover:bg-base-300 cursor-pointer"
      :class="activeSection === sec.section ? `text-${theme} font-semibold` : 'opacity-60'"
      @click.stop="emit('selectSection', sec.section)"
    >
      <component :is="resolveIcon(sec.icon)" v-if="sec.icon" class="w-3 h-3 shrink-0" />
      <span class="truncate">{{ sec.label }}</span>
    </button>
  </template>
</template>

<script setup lang="ts">
  import { GripVertical, EyeOff } from 'lucide-vue-next'
  import { SidebarSectionItem } from './useSidebarSectionMap'
  import { LucideIconName, resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'

  defineProps<{
    itemKey: string
    label: string
    isEnabled?: boolean
    isSelected: boolean
    draggable?: boolean
    theme: string
    sections: SidebarSectionItem[]
    activeSection: string | null
  }>()

  const emit = defineEmits<{
    select: []
    selectSection: [section: string]
  }>()

  function resolveIcon(name?: string) {
    if (!name) return null
    return resolveLucideIcon(name as LucideIconName)
  }
</script>
