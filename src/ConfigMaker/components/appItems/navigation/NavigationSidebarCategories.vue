<!-- src/ConfigMaker/components/appItems/navigation/NavigationSidebarCategories.vue -->
<template>
  <div class="flex flex-col gap-0.5 p-2 flex-1">
    <template v-for="(tab, key) in filteredCategoryLabels" :key="key">
      <!-- カテゴリボタン -->
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

      <!-- サブアイテム（展開時 & 選択中カテゴリのみ） -->
      <SidebarSubItems
        v-if="isExpanded && selectedItemKey && selectedCategory === key"
        :category="key"
        :isRecord="isRecordCategory(key)"
        :variant="subItemsVariant(key)"
        v-model="getDraggableModel(key).value"
        :staticItems="getStaticSubItems(key)"
        :selectedItemKey="selectedItemKey"
        :activeSection="activeSection"
        :theme="theme"
        @selectItem="(itemKey, section) => navigationStore.selectItem(itemKey, section)"
        @selectSection="onSelectSection"
        @dragEnd="onDragEnd"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CategoryType, SettingsCategoryType } from '@/types/OmikujiData/'
  import { uiKindMap } from '@/types/MetaMaps/UiKindMaps'
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

  // ── ストア ─────────────────────────────────────────────
  const navigationStore = useNavigationStore()
  const { isRecordCategory, selectCategory } = navigationStore
  const { selectedCategory, selectedItemKey, activeSection } = storeToRefs(navigationStore)

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // ── カテゴリユーティリティ ────────────────────────────
  const { getCategoryItemCount, filteredCategoryLabels } = useCategoryUtils()
  const { draggableItems, onDragEnd } = useNavigationSidebarDrag(computed(() => props.isExpanded))

  // ── ナビゲーション ────────────────────────────────────
  const navigateCategory = (key: CategoryType) => selectCategory(key)

  const onSelectSection = (section: string) => {
    activeSection.value = section
  }

  // ── ボタンスタイル ────────────────────────────────────
  const categoryButtonClass = (key: CategoryType) => {
    if (selectedCategory.value !== key) return 'btn-ghost'
    const color = props.theme
    return `bg-${color} text-${color}-content hover:bg-${color}`
  }

  const categoryIcon = (icon: LucideIconName) => resolveLucideIcon(icon)

  // ── サブアイテムバリアント ─────────────────────────────
  const ARRAY_CATEGORIES: SettingsCategoryType[] = ['jsonMerge']
  const OBJECT_CATEGORIES: SettingsCategoryType[] = ['components', 'appInfo']

  const subItemsVariant = (key: CategoryType): SubItemsVariant => {
    if (ARRAY_CATEGORIES.includes(key as SettingsCategoryType)) return 'array'
    if (OBJECT_CATEGORIES.includes(key as SettingsCategoryType)) return 'object'
    return 'record'
  }

  // ── 静的サブアイテム ──────────────────────────────────
  type StaticSubItem = { key: string; label: string }

  const getStaticSubItems = (category: CategoryType): StaticSubItem[] => {
    // jsonMerge: 配列
    if (category === 'jsonMerge') {
      return data.value.jsonMerge.map((item) => ({
        key: item.key,
        label: item.name || '（名前なし）',
      }))
    }

    // components: Object のキー一覧
    if (category === 'components') {
      return Object.keys(data.value.components.settings)
        .filter((k) => data.value.components.settings[k as keyof typeof data.value.components.settings] !== undefined)
        .map((k) => ({
          key: k,
          label: uiKindMap[k as keyof typeof uiKindMap]?.label ?? k,
        }))
    }

    // appInfo: 仮置き（TODO: 実際の項目が確定次第更新）
    if (category === 'appInfo') {
      return [{ key: 'general', label: 'アプリ情報' }]
    }

    return []
  }

  // ── ドラッグモデル ────────────────────────────────────
  const getDraggableModel = (key: CategoryType) =>
    computed({
      get: () => draggableItems.value[key] ?? [],
      set: (val) => {
        draggableItems.value[key] = val
      },
    })
</script>
