<!-- src/ConfigMaker/components/appItems/NavigationSidebar.vue -->
<template>
  <aside
    class="sticky top-0 h-screen flex flex-col border-r overflow-y-auto transition-all duration-200 shrink-0"
    :class="sidebarClass"
    :style="{ width: isExpanded ? '200px' : '72px' }"
  >
    <!-- 折りたたみトグル -->
    <button class="btn btn-ghost btn-sm mx-auto mt-3 mb-1 shrink-0" @click="isExpanded = !isExpanded">
      <PanelLeftClose v-if="isExpanded" class="w-5 h-5" />
      <PanelLeftOpen v-else class="w-5 h-5" />
    </button>

    <nav class="flex flex-col gap-0.5 p-2 flex-1">
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
        <template v-if="isExpanded && selectedCategory === key">
          <VueDraggable
            v-if="isRecordCategory(key)"
            v-model="draggableItems[key]"
            :animation="150"
            handle=".drag-handle"
            @end="onDragEnd(key as RecordCategoryType)"
          >
            <div
              v-for="item in draggableItems[key]"
              :key="item.key"
              class="group flex items-center gap-1 pl-4 pr-1 rounded hover:bg-base-300 cursor-pointer"
              :class="selectedItemKey === item.key ? `bg-${theme} text-${theme}-content` : ''"
              @click="navigationStore.selectItem(item.key)"
            >
              <!-- ドラッグハンドル -->
              <GripVertical class="drag-handle w-3 h-3 shrink-0 opacity-0 group-hover:opacity-30 cursor-grab" />

              <!-- 無効アイコン -->
              <EyeOff v-if="item.isEnabled === false" class="w-3 h-3 shrink-0 opacity-40" />

              <!-- 名前（無効時は打ち消し線） -->
              <span
                class="text-xs py-1 truncate flex-1 min-w-0"
                :class="[
                  selectedItemKey !== item.key ? 'opacity-70' : '',
                  item.isEnabled === false ? 'line-through' : '',
                ]"
              >
                {{ item.label }}
              </span>

              <!-- ハンバーガーメニュー -->
              <SidebarItemMenu :item="item.rawItem" :category="key as RecordCategoryType" />
            </div>
          </VueDraggable>

          <!-- jsonMerge / components（ドラッグなし） -->
          <template v-else>
            <div
              v-for="item in getStaticSubItems(key)"
              :key="item.key"
              class="group flex items-center gap-1 pl-6 pr-1 rounded hover:bg-base-300 cursor-pointer"
              :class="selectedItemKey === item.key ? `bg-${theme} text-${theme}-content` : ''"
              @click="navigationStore.selectItem(item.key)"
            >
              <span
                class="text-xs py-1 truncate flex-1 min-w-0"
                :class="selectedItemKey !== item.key ? 'opacity-70' : ''"
              >
                {{ item.label }}
              </span>
            </div>
          </template>

          <div
            v-if="(draggableItems[key]?.length ?? getStaticSubItems(key).length) === 0"
            class="pl-8 py-1 text-xs opacity-40"
          >
            （なし）
          </div></template
        >
      </template>
    </nav>
  </aside>
</template>

<script setup lang="ts">
  import { ref, computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { VueDraggable } from 'vue-draggable-plus'
  import { PanelLeftClose, PanelLeftOpen, GripVertical, EyeOff } from 'lucide-vue-next'
  import { CategoryType, RecordCategoryType } from '@/types/OmikujiData/'
  import { uiKindMap } from '@/types/MetaMaps/UiKindMaps'
  import { BaseRecordType } from '@shared/types'
  import { useCategoryUtils } from './useCategoryUtils'
  import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { LucideIconName, resolveLucideIcon } from '@shared/utils/LucideIcon/useLucideIcon'
  import { storeToRefs as storeTR } from 'pinia'
  import SidebarItemMenu from './SidebarItemMenu.vue'

  const navigationStore = useNavigationStore()
  const { isRecordCategory } = useNavigationStore()
  const { selectedCategory, selectedItemKey } = storeToRefs(navigationStore)
  const { getCategoryItemCount, filteredCategoryLabels } = useCategoryUtils()
  const { isPro, isGod } = useSettingMode()
  const { getCategoryArray } = useGetRecordData()
  const omikujiStore = useOmikujiStore()
  const { data } = storeTR(omikujiStore)

  const isExpanded = ref(false)

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
    navigationStore.selectCategory(key)
  }

  // ---------------------------------------------------
  // ドラッグ用のアイテム型
  // ---------------------------------------------------
  type DraggableSubItem = {
    key: string
    label: string
    isEnabled?: boolean
    rawItem: BaseRecordType
  }

  // RecordCategory ごとのドラッグ配列
  // selectedCategory が変わるたびに再構築
  const draggableItems = ref<Record<CategoryType, DraggableSubItem[]>>({} as Record<CategoryType, DraggableSubItem[]>)
  const buildDraggableItems = (category: RecordCategoryType): DraggableSubItem[] =>
    getCategoryArray(category).map((item) => ({
      key: item.key,
      label: item.name || '（名前なし）',
      isEnabled: item.isEnabled,
      rawItem: item as BaseRecordType,
    }))

  // 展開中カテゴリが RecordCategory なら配列を初期化
  watch(
    [selectedCategory, isExpanded],
    ([cat, expanded]) => {
      if (!expanded || !isRecordCategory(cat)) return
      draggableItems.value[cat] = buildDraggableItems(cat)
    },
    { immediate: true }
  )

  // ストアのデータが変わったとき（追加・削除・名前変更）も同期
  watch(
    () => {
      const cat = selectedCategory.value
      if (!isRecordCategory(cat)) return null
      return getCategoryArray(cat)
    },
    () => {
      const cat = selectedCategory.value
      if (!isRecordCategory(cat)) return
      draggableItems.value[cat] = buildDraggableItems(cat)
    },
    { deep: true }
  )

  // ドラッグ完了 → order を書き直す
  const onDragEnd = (category: RecordCategoryType) => {
    const items = draggableItems.value[category]
    if (!items) return
    items.forEach((item, index) => {
      omikujiStore.updateItem(category, item.key, {
        ...item.rawItem,
        order: index,
      })
    })
  }

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
