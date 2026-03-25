<template>
  <div class="flex flex-col gap-0.5 p-2 flex-1">
    <template v-for="(tab, key) in filteredCategoryLabels" :key="key">
      <button
        class="btn btn-ghost w-full relative flex items-center gap-2 min-h-0 h-auto py-2"
        :class="[categoryButtonClass(key), isExpanded ? 'justify-start px-3' : 'justify-center px-0']"
        :title="`${tab.label}：${tab.description}`"
        @click="navigateCategory(key)"
      >
        <component :is="categoryIcon(tab.icon)" class="w-5 h-5 shrink-0" />
        <span v-if="isExpanded" class="text-sm truncate text-left flex-1">
          {{ tab.label }}
        </span>
        <span
          v-if="getCategoryItemCount(key) > 0"
          class="badge badge-xs badge-primary shrink-0"
          :class="isExpanded ? '' : 'absolute -top-1 -right-1'"
        >
          {{ getCategoryItemCount(key) }}
        </span>
      </button>

      <SidebarSubItems
        v-if="isExpanded && selectedCategory === key && shouldShowSubItems(key)"
        :category="key"
        :isRecord="isRecordCategory(key)"
        :variant="subItemsVariant(key)"
        v-model="getDraggableModel(key).value"
        :staticItems="getStaticSubItems(key)"
        :selectedItemKey="selectedItemKey ?? ''"
        :activeSection="activeSection"
        :theme="theme"
        :isDragging="isDragging"
        :isDragDisabled="isDragDisabled"
        @selectItem="(itemKey, section) => navigationStore.selectItem(itemKey, section)"
        @selectSection="onSelectSection"
        @update:isDragDisabled="(val) => (isDragDisabled = val)"
        @dragStart="onDragStart"
        @dragEnd="onDragEnd"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CategoryType, SettingsCategoryType } from '@/types/OmikujiData/'
  import { useCategoryUtils } from './useCategoryUtils'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { LucideIconName, resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'
  import { useNavigationSidebarDrag } from './useNavigationSidebarDrag'
  import { SubItemsVariant } from './SidebarSubItems.vue'
  import SidebarSubItems from './SidebarSubItems.vue'

  const props = defineProps<{
    isExpanded: boolean
    theme: string
  }>()

  const navigationStore = useNavigationStore()
  const { isRecordCategory, selectCategory } = navigationStore
  const { selectedCategory, selectedItemKey, activeSection } = storeToRefs(navigationStore)

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const { getCategoryItemCount, filteredCategoryLabels } = useCategoryUtils()
  const { draggableItems, onDragEnd, isDragging, onDragStart, isDragDisabled } = useNavigationSidebarDrag(
    computed(() => props.isExpanded)
  )

  const navigateCategory = (key: CategoryType) => selectCategory(key)
  const onSelectSection = (section: string) => {
    activeSection.value = section
  }

  const categoryButtonClass = (key: CategoryType) => {
    if (selectedCategory.value !== key) return 'btn-ghost'
    return `bg-${props.theme} text-${props.theme}-content hover:bg-${props.theme}`
  }

  const categoryIcon = (icon: LucideIconName) => resolveLucideIcon(icon)

  const NON_RECORD_CATEGORIES: SettingsCategoryType[] = ['jsonMerge', 'components', 'appInfo']

  // Record カテゴリはアイテム選択後にのみサブ項目を表示する
  const shouldShowSubItems = (key: CategoryType): boolean => {
    if (NON_RECORD_CATEGORIES.includes(key as SettingsCategoryType)) return true
    return !!selectedItemKey.value
  }

  const ARRAY_CATEGORIES: SettingsCategoryType[] = ['jsonMerge']
  const OBJECT_CATEGORIES: SettingsCategoryType[] = ['components', 'appInfo']

  const subItemsVariant = (key: CategoryType): SubItemsVariant => {
    if (ARRAY_CATEGORIES.includes(key as SettingsCategoryType)) return 'array'
    if (OBJECT_CATEGORIES.includes(key as SettingsCategoryType)) return 'object'
    return 'record'
  }

  type StaticSubItem = { key: string; label: string }

  const getStaticSubItems = (category: CategoryType): StaticSubItem[] => {
    if (category === 'jsonMerge') {
      return data.value.jsonMerge.map((item) => ({
        key: item.key,
        label: item.name || '（名前なし）',
      }))
    }
    if (category === 'appInfo') return [{ key: 'general', label: 'アプリ情報' }]
    return []
  }

  const getDraggableModel = (key: CategoryType) =>
    computed({
      get: () => draggableItems.value[key] ?? [],
      set: (val) => {
        draggableItems.value[key] = val
      },
    })
</script>
