// src/ConfigMaker/components/appItems/navigation/useSidebarSectionMap.ts
import { ComputedRef, computed } from 'vue'
import { CategoryType } from '@/types/OmikujiData/'
import { uiItemMap } from '@config/UiEditor/useUiItemMap'
import { useUiVisibility } from '@config/UiEditor/conditions/useUiVisibility'
import { SidebarSectionItem, staticSectionMap } from './StaticSectionMap'

// ─────────────────────────────────────────────────────────
// 動的マップ（components）
// ─────────────────────────────────────────────────────────

/**
 * UiEditor の visibleItems と同じ条件でフィルタしたセクション項目を返す
 *
 * UiEditor.vue の activeSection は uiItemMap のキー（'bubble', 'toast' など）と
 * 固定エントリ（'itemConditions'）で構成される。
 * navigationStore.activeSection をそのまま UiEditor の activeSection として共用する。
 */
export function useComponentsSections(): ComputedRef<SidebarSectionItem[]> {
  const { hasComponentKind, visibilityMap } = useUiVisibility()

  return computed<SidebarSectionItem[]>(() => {
    // 固定エントリ（アイテム表示設定セクション）
    const fixed: SidebarSectionItem[] = [{ section: 'itemConditions', label: 'アイテム表示設定', icon: 'LayoutGrid' }]

    // uiItemMap から visibleItems と同じ条件でフィルタ
    const dynamic: SidebarSectionItem[] = Object.entries(uiItemMap)
      .filter(([_key, item]) => {
        if (item.targetKey && !hasComponentKind(item.targetKey)) return false
        return item.visibility.every((v) => {
          if (v.startsWith('!')) {
            const key = v.slice(1) as keyof typeof visibilityMap.value
            return !visibilityMap.value[key]
          }
          return visibilityMap.value[v as keyof typeof visibilityMap.value]
        })
      })
      .map(([key, item]) => ({
        section: key,
        label: item.title,
        icon: item.icon,
      }))

    return [...fixed, ...dynamic]
  })
}

// ─────────────────────────────────────────────────────────
// 公開 API
// ─────────────────────────────────────────────────────────

/**
 * カテゴリのセクション項目を返す
 * components は useComponentsSections() を使うこと
 */
export function getSidebarSections(category: Exclude<CategoryType, 'components'>): SidebarSectionItem[] {
  return staticSectionMap[category] ?? []
}
