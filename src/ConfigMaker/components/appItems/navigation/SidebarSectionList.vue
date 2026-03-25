<!-- src/ConfigMaker/components/appItems/navigation/SidebarSectionList.vue -->
<!--
  セクション項目のリスト表示
  SidebarSubItem のセクション展開部分と同じ見た目を、
  サブアイテムを持たないカテゴリ（components / appInfo）でも再利用する
-->
<template>
  <button
    v-for="sec in sections"
    :key="sec.section"
    class="w-full flex items-center gap-1.5 pl-6 pr-2 py-0.5 text-xs rounded hover:bg-base-300 cursor-pointer"
    :class="activeSection === sec.section ? `text-${theme} font-semibold` : 'opacity-60'"
    @click="emit('selectSection', sec.section)"
  >
    <component :is="resolveIcon(sec.icon)" v-if="sec.icon" class="w-3 h-3 shrink-0" />
    <span class="truncate">{{ sec.label }}</span>
  </button>
</template>

<script setup lang="ts">
  import { LucideIconName, resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'
  import { SidebarSectionItem } from './StaticSectionMap'

  defineProps<{
    sections: SidebarSectionItem[]
    activeSection: string | null
    theme: string
  }>()

  const emit = defineEmits<{
    selectSection: [section: string]
  }>()

  function resolveIcon(name?: string) {
    if (!name) return null
    return resolveLucideIcon(name as LucideIconName)
  }
</script>
