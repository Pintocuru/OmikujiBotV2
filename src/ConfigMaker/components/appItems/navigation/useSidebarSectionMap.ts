// src/ConfigMaker/components/appItems/navigation/useSidebarSectionMap.ts

import { CategoryType } from '@/types/OmikujiData/'

/**
 * サイドバーのサブアイテム下に表示するセクション項目の定義
 * クリックで activeSection.value を変更する
 *
 * NOTE: カテゴリごとに項目は異なる。
 * 各エディタの SectionCard の id と合わせること。
 */
export type SidebarSectionItem = {
  /** activeSection にセットする値 */
  section: string
  /** 表示ラベル */
  label: string
  /** lucide アイコン名（省略可） */
  icon?: string
}

/**
 * カテゴリ別セクション項目マップ
 * TODO: 各カテゴリの実際のセクションが確定次第、随時追記する
 */
export const sidebarSectionMap: Partial<Record<CategoryType, SidebarSectionItem[]>> = {
  // ── ルール系 ──────────────────────────────────────────
  comments: [
    { section: 'baseSettings', label: '基本設定', icon: 'SlidersHorizontal' },
    { section: 'threshold', label: '発動条件', icon: 'Filter' },
    { section: 'limits', label: '制限設定', icon: 'Timer' },
    { section: 'omikujiSet', label: 'おみくじ設定', icon: 'ListChecks' },
  ],

  timers: [
    { section: 'baseSettings', label: '基本設定', icon: 'SlidersHorizontal' },
    { section: 'omikujiSet', label: 'おみくじ設定', icon: 'ListChecks' },
    // TODO: タイマー固有セクション追加
  ],

  metas: [
    { section: 'baseSettings', label: '基本設定', icon: 'SlidersHorizontal' },
    { section: 'omikujiSet', label: 'おみくじ設定', icon: 'ListChecks' },
    // TODO: metas 固有セクション追加
  ],

  reactions: [
    { section: 'baseSettings', label: '基本設定', icon: 'SlidersHorizontal' },
    { section: 'omikujiSet', label: 'おみくじ設定', icon: 'ListChecks' },
    // TODO: reactions 固有セクション追加
  ],

  // ── リソース系 ────────────────────────────────────────
  actionSets: [
    { section: 'baseSettings', label: '基本設定', icon: 'SlidersHorizontal' },
    // TODO: アクションセット固有セクション追加
  ],

  placeholders: [
    { section: 'baseSettings', label: '基本設定', icon: 'SlidersHorizontal' },
    // TODO: プレースホルダー固有セクション追加
  ],

  characters: [
    { section: 'baseSettings', label: '基本設定', icon: 'SlidersHorizontal' },
    // TODO: キャラクター固有セクション追加
  ],

  // ── 設定系（仮置き） ─────────────────────────────────
  components: [
    // TODO: components 固有セクション追加
  ],

  // jsonMerge / appInfo は items 単位でセクションなし（仮置き）
}

/**
 * 指定カテゴリのセクション項目を返す
 * 定義がない場合は空配列
 */
export function getSidebarSections(category: CategoryType): SidebarSectionItem[] {
  return sidebarSectionMap[category] ?? []
}
