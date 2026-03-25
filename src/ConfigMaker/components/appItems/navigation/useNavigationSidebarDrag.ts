// src/ConfigMaker/components/appItems/navigation/useNavigationSidebarDrag.ts
import { Ref, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { CategoryType, RecordCategoryType } from '@/types/OmikujiData/'
import { BaseRecordType } from '@shared/types'
import { useNavigationStore } from '@config/stores/useNavigationStore'
import { useGetRecordData } from '@config/stores/useGetRecordData'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'

type DraggableSubItem = {
  key: string
  label: string
  isEnabled?: boolean
  rawItem: BaseRecordType
}

export const useNavigationSidebarDrag = (isExpanded: Readonly<Ref<boolean>>) => {
  const navigationStore = useNavigationStore()
  const { isRecordCategory } = navigationStore
  const { selectedCategory } = storeToRefs(navigationStore)
  const { getCategoryArray } = useGetRecordData()
  const omikujiStore = useOmikujiStore()

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

  // ストアのデータ変更（追加・削除・名前変更）に追従
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

  return { draggableItems, onDragEnd }
}
