<!-- src/ConfigMaker/components/appItems/NavigationSidebar.vue -->
<template>
  <div
    class="sticky top-0 h-screen flex flex-col border-r overflow-y-auto transition-all duration-200 shrink-0"
    :class="sidebarClass"
    :style="{ width: isExpanded ? '200px' : '72px' }"
  >
    <!-- 折りたたみトグル -->
    <button class="btn btn-ghost btn-sm mx-auto mt-3 mb-1 shrink-0" @click="isExpanded = !isExpanded">
      <PanelLeftClose v-if="isExpanded" class="w-5 h-5" />
      <PanelLeftOpen v-else class="w-5 h-5" />
    </button>

    <div class="flex flex-col gap-0.5 p-2 flex-1">
      <template v-for="(tab, key) in filteredCategoryLabels" :key="key">
        <!-- カテゴリボタン -->
        <div>
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

            <!-- バッジ -->
            <span
              v-if="getCategoryItemCount(key) > 0"
              class="badge badge-xs badge-primary shrink-0"
              :class="isExpanded ? '' : 'absolute -top-1 -right-1'"
            >
              {{ getCategoryItemCount(key) }}
            </span>
          </button>
        </div>

        <!-- サブアイテム（展開時のみ） -->
        <SidebarSubItems
          v-if="isExpanded && selectedItemKey && selectedCategory === key"
          :category="key"
          :isRecord="isRecordCategory(key)"
          v-model="getDraggableModel(key).value"
          :staticItems="getStaticSubItems(key)"
          :selectedItemKey="selectedItemKey"
          :theme="theme"
          @selectItem="navigationStore.selectItem"
          @dragEnd="onDragEnd"
        />
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { PanelLeftClose, PanelLeftOpen } from 'lucide-vue-next'
  import { CategoryType } from '@/types/OmikujiData/'
  import { uiKindMap } from '@/types/MetaMaps/UiKindMaps'
  import { useCategoryUtils } from './useCategoryUtils'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { LucideIconName, resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'
  import { storeToRefs as storeTR } from 'pinia'
  import { useNavigationSidebarDrag } from './useNavigationSidebarDrag'
  import SidebarSubItems from './SidebarSubItems.vue'

  const navigationStore = useNavigationStore()
  const { isRecordCategory, selectCategory } = useNavigationStore()
  const { selectedCategory, selectedItemKey } = storeToRefs(navigationStore)
  const { getCategoryItemCount, filteredCategoryLabels } = useCategoryUtils()
  const { isPro, isGod } = useSettingMode()
  const omikujiStore = useOmikujiStore()
  const { data } = storeTR(omikujiStore)

  const isExpanded = ref(false)
  const { draggableItems, onDragEnd } = useNavigationSidebarDrag(isExpanded)

  const theme = computed(() => {
    if (isGod.value) return 'warning'
    if (isPro.value) return 'success'
    return 'primary'
  })

  const sidebarClass = computed(() => {
    if (isGod.value) return 'border-warning bg-base-200'
    if (isPro.value) return 'border-success bg-base-200'
    return 'border-base-300 bg-base-200'
  })

  const categoryButtonClass = (key: CategoryType) => {
    if (selectedCategory.value !== key) return 'btn-ghost'
    return `bg-${theme.value} text-${theme.value}-content hover:bg-${theme.value}`
  }

  const categoryIcon = (icon: LucideIconName) => resolveLucideIcon(icon)

  const navigateCategory = (key: CategoryType) => {
    selectCategory(key)
  }

  // SidebarSubItems 用の v-model ヘルパー
  const getDraggableModel = (key: CategoryType) =>
    computed({
      get: () => draggableItems.value[key] ?? [],
      set: (val) => {
        draggableItems.value[key] = val
      },
    })

  // ---------------------------------------------------
  // 静的サブアイテム（jsonMerge / components）
  // ---------------------------------------------------
  type StaticSubItem = { key: string; label: string }

  const getStaticSubItems = (category: CategoryType): StaticSubItem[] => {
    if (category === 'jsonMerge') {
      return data.value.jsonMerge.map((item) => ({
        key: item.key,
        label: item.name || '（名前なし）',
      }))
    }
    if (category === 'components') {
      return Object.keys(data.value.components.settings)
        .filter((k) => data.value.components.settings[k as keyof typeof data.value.components.settings] !== undefined)
        .map((k) => ({
          key: k,
          label: uiKindMap[k as keyof typeof uiKindMap]?.label ?? k,
        }))
    }
    return []
  }
</script>
