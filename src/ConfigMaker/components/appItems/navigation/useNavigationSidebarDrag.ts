// src/ConfigMaker/components/appItems/navigation/useNavigationSidebarDrag.ts
import { Ref, ref, watch, nextTick } from 'vue'
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

  // ドラッグ処理中フラグ: ストア変更 watch による配列の上書きを防ぐ
  const isDragging = ref(false)

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
  // ドラッグ中は上書きしない（競合防止）
  watch(
    () => {
      const cat = selectedCategory.value
      if (!isRecordCategory(cat)) return null
      return getCategoryArray(cat)
    },
    () => {
      if (isDragging.value) return

      const cat = selectedCategory.value
      if (!isRecordCategory(cat)) return
      draggableItems.value[cat] = buildDraggableItems(cat)
    },
    { deep: true }
  )
  const isDragDisabled = ref(false)
  const onDragStart = () => {
    console.log('🔥 Drag Start Detected!') // これがコンソールに出るか確認
    isDragging.value = true
  }

  const onDragEnd = async (category: RecordCategoryType) => {
    // スナップショットを即座に取得（この時点の配列順序が正）
    const snapshot = [...(draggableItems.value[category] ?? [])]
    if (snapshot.length === 0) return

    // キー配列だけ抽出（undefined は除外）
    const orderedKeys = snapshot.map((i) => i?.key).filter((k): k is string => !!k)
    if (orderedKeys.length === 0) return

    isDragging.value = true

    // Vue の描画サイクルが完了するのを待ってからストアを更新する
    await nextTick()

    try {
      // reorderItems でカテゴリ全体を1回のオブジェクト代入で更新
      // → Pinia の変更通知が1回だけ発火し、watch の多重発火を防ぐ
      omikujiStore.reorderItems(category, orderedKeys)
    } finally {
      // 更新完了後にフラグを解除し、watch を再活性化
      await nextTick()
      isDragging.value = false
    }
  }

  return { draggableItems, onDragEnd, onDragStart, isDragging, isDragDisabled }
}
