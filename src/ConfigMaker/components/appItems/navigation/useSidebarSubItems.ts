// src/ConfigMaker/components/appItems/navigation/useSidebarSubItems.ts
import { storeToRefs } from 'pinia'
import { CategoryType, SettingsCategoryType } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { useComponentsSections, getSidebarSections } from './useSidebarSectionMap'
import { SidebarSectionItem } from './StaticSectionMap'

// ─────────────────────────────────────────────────────────
// 定数
// ─────────────────────────────────────────────────────────

export type SubItemsVariant = 'record' | 'array' | 'object'

const ARRAY_CATEGORIES: SettingsCategoryType[] = ['jsonMerge']
const OBJECT_CATEGORIES: SettingsCategoryType[] = ['components', 'appInfo']

// ─────────────────────────────────────────────────────────
// composable
// ─────────────────────────────────────────────────────────

export const useSidebarSubItems = () => {
  const { data } = storeToRefs(useOmikujiStore())
  const componentsSections = useComponentsSections() // ComputedRef<SidebarSectionItem[]>

  /** カテゴリの表示バリアントを返す */
  const getVariant = (key: CategoryType): SubItemsVariant => {
    if (ARRAY_CATEGORIES.includes(key as SettingsCategoryType)) return 'array'
    if (OBJECT_CATEGORIES.includes(key as SettingsCategoryType)) return 'object'
    return 'record'
  }

  /**
   * jsonMerge / appInfo の静的アイテムリストを返す。
   * どちらでもないカテゴリでは呼ばれないが、型上は空配列を返す。
   */
  const getStaticItems = (category: CategoryType): { key: string; label: string }[] => {
    if (category === 'jsonMerge') {
      return data.value.jsonMerge.map((item) => ({
        key: item.key,
        label: item.name || '（名前なし）',
      }))
    }
    if (category === 'appInfo') return [{ key: 'general', label: 'アプリ情報' }]
    return []
  }

  /**
   * object バリアント（appInfo / components）のセクションリストを返す。
   * 戻り値は常に SidebarSectionItem[]（ComputedRef を unwrap 済み）にせず、
   * components だけリアクティブが必要なので ComputedRef のまま返す。
   * 呼び出し側は toValue() または .value で受けること。
   */
  const getSections = (category: CategoryType): SidebarSectionItem[] | typeof componentsSections => {
    if (category === 'components') return componentsSections
    return getSidebarSections(category as Exclude<CategoryType, 'components'>)
  }

  return { getVariant, getStaticItems, getSections }
}
