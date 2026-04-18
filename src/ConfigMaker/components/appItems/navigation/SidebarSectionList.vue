<!-- src/ConfigMaker/components/appItems/navigation/SidebarSectionList.vue -->
<template>
  <div class="relative">
    <button
      v-for="sec in sections"
      :key="sec.section"
      class="w-full flex items-center gap-1.5 pl-6 pr-2 py-0.5 text-xs rounded hover:bg-base-300 cursor-pointer"
      :class="activeSection === sec.section ? `text-${theme} font-semibold` : 'opacity-60'"
      @mouseenter="onEnter($event, sec)"
      @mouseleave="onLeave"
      @click="emit('selectSection', sec.section)"
    >
      <component :is="resolveIcon(sec.icon)" v-if="sec.icon" class="w-3 h-3 shrink-0" />
      <span class="truncate">{{ sec.label }}</span>
    </button>

    <!-- TODO:実装 Hover Popup
    <HoverPopup v-if="hoveredSection?.component" :x="mouseX" :y="mouseY" :visible="!!hoveredSection">
      <component :is="staticSectionPreviewMap[hoveredSection.component]" :data="hoveredItem" :mode="category" />
    </HoverPopup> -->
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { LucideIconName, resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'
  import { SidebarSectionItem } from './StaticSectionMap'
  import HoverPopup from '../preview/HoverPopup.vue'
  import { staticSectionPreviewMap } from '../preview/staticSectionPreviewMap'
  import { CategoryType, isRecordCategory } from '@/types'
  import { useGetRecordData } from '@config/stores/useGetRecordData'

  const props = defineProps<{
    category: CategoryType
    itemKey?: string
    sections: SidebarSectionItem[]
    activeSection: string | null
    theme: string
  }>()

  const emit = defineEmits<{
    selectSection: [section: string]
  }>()

  const { getItem } = useGetRecordData()

  // hover state
  const hoveredSection = ref<SidebarSectionItem | null>(null)
  const mouseX = ref(0)
  const mouseY = ref(0)

  let timer: number

  const onEnter = (e: MouseEvent, sec: SidebarSectionItem) => {
    clearTimeout(timer)

    mouseX.value = e.clientX
    mouseY.value = e.clientY

    timer = window.setTimeout(() => {
      hoveredSection.value = sec
    }, 120)
  }

  const onLeave = () => {
    clearTimeout(timer)
    hoveredSection.value = null
  }

  // ★ データ取得（computedでシンプルに）
  const hoveredItem = computed(() => {
    if (!hoveredSection.value || !props.itemKey) return null

    if (isRecordCategory(props.category)) {
      return getItem(props.category, props.itemKey)
    }

    return null
  })

  function resolveIcon(name?: string) {
    if (!name) return null
    return resolveLucideIcon(name as LucideIconName)
  }
</script>
