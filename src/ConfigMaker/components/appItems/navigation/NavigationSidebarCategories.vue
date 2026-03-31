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
        <component :is="resolveLucideIcon(tab.icon)" class="w-5 h-5 shrink-0" />
        <span v-if="isExpanded" class="text-sm truncate text-left flex-1">{{ tab.label }}</span>
        <span
          v-if="getCategoryItemCount(key) > 0"
          class="badge badge-xs badge-primary shrink-0"
          :class="isExpanded ? '' : 'absolute -top-1 -right-1'"
        >
          {{ getCategoryItemCount(key) }}
        </span>
      </button>

      <!-- サブ項目（サイドバー展開中 & カテゴリ選択中 & 開いているときのみ） -->
      <transition
        enter-active-class="transition-all duration-200 ease-out"
        leave-active-class="transition-all duration-150 ease-in"
        enter-from-class="opacity-0 max-h-0"
        enter-to-class="opacity-100 max-h-96"
        leave-from-class="opacity-100 max-h-96"
        leave-to-class="opacity-0 max-h-0"
      >
        <template v-if="isExpanded && selectedCategory === key && isOpenCategory[key]">
          <!-- Record：ドラッグ可能なアイテムリスト（アイテム選択済みのときのみ表示） -->
          <SidebarRecordItems
            v-if="getVariant(key) === 'record' && selectedItemKey"
            :category="key"
            v-model="getDraggableModel(key).value"
            v-model:isDragEnabled="isDragEnabled"
            @dragEnd="onDragEnd"
          />

          <!-- Array：jsonMerge の静的リスト -->
          <SidebarArrayItems v-else-if="getVariant(key) === 'array'" :category="key" :items="getStaticItems(key)" />

          <!-- Object：appInfo / components のセクションリスト -->
          <SidebarObjectItems v-else-if="getVariant(key) === 'object'" :category="key" />
        </template>
      </transition>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { CategoryType } from '@/types/OmikujiData/'
  import { useCategoryUtils } from './useCategoryUtils'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'
  import { useNavigationSidebarDrag } from './useNavigationSidebarDrag'
  import { useSidebarSubItems } from './useSidebarSubItems'
  import { provideSidebarContext } from './useSidebarContext'
  import SidebarRecordItems from './SidebarRecordItems.vue'
  import SidebarArrayItems from './SidebarArrayItems.vue'
  import SidebarObjectItems from './SidebarObjectItems.vue'

  const props = defineProps<{
    isExpanded: boolean
    theme: string
  }>()

  // Context（theme / selectedItemKey / activeSection を子孫全体に注入）
  provideSidebarContext(computed(() => props.theme))

  // ストア
  const navigationStore = useNavigationStore()
  const { selectedCategory, selectedItemKey } = storeToRefs(navigationStore)

  // カテゴリユーティリティ
  const { getCategoryItemCount, filteredCategoryLabels } = useCategoryUtils()

  // ドラッグ
  const { draggableItems, onDragEnd, isDragDisabled } = useNavigationSidebarDrag(computed(() => props.isExpanded))
  // isDragDisabled（ドラッグ中フラグ）を isDragEnabled として子に渡す
  const isDragEnabled = computed({
    get: () => isDragDisabled.value,
    set: (val) => (isDragDisabled.value = val),
  })

  const getDraggableModel = (key: CategoryType) =>
    computed({
      get: () => draggableItems.value[key] ?? [],
      set: (val) => {
        draggableItems.value[key] = val
      },
    })

  // サブ項目ロジック
  const { getVariant, getStaticItems } = useSidebarSubItems()

  // 開閉状態
  const isOpenCategory = ref<Record<string, boolean>>({})

  const navigateCategory = (key: CategoryType) => {
    isOpenCategory.value = { [key]: !isOpenCategory.value[key] }
    navigationStore.selectCategory(key)
  }

  // スタイル
  const categoryButtonClass = (key: CategoryType) => {
    if (selectedCategory.value !== key) return 'btn-ghost'
    return `bg-${props.theme} text-${props.theme}-content hover:bg-${props.theme}`
  }
</script>
