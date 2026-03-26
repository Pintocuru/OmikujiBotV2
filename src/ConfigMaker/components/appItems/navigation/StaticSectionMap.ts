// src/ConfigMaker/components/appItems/navigation/StaticSectionMap.ts
import { CategoryType } from '@/types'
import { LucideIconName } from '@shared/utils/LucideIcon/useLucideIcon'

/**
 * サイドバーのサブアイテム下に表示するセクション項目
 * クリックで activeSection.value を変更する
 */
export type SidebarSectionItem = {
  section: string
  label: string
  icon: LucideIconName
  description?: string
  component?: string
}

// ─────────────────────────────────────────────────────────
// 静的マップ（Record カテゴリ / appInfo）
// ─────────────────────────────────────────────────────────

/**
 * Record カテゴリ・appInfo 用の固定セクション項目
 * UiEditor のような動的なものはここに含めない
 */
export const staticSectionMap: Record<CategoryType, SidebarSectionItem[]> = {
  // ── ルール系 ───────────────────────────────────────────
  comments: [
    {
      section: 'baseSettings',
      label: '基本設定',
      icon: 'SlidersHorizontal',
      description: 'コメントイベントの基本設定',
      component: 'baseSettings',
    },
    {
      section: 'threshold',
      label: '発動条件',
      icon: 'Filter',
      description: '「おみくじを引く」発動条件の設定',
      component: 'threshold',
    },
    {
      section: 'limits',
      label: '制限設定',
      icon: 'Timer',
      description: '重複時や回数超過時におみくじを無効にします',
      component: 'limits',
    },
    {
      section: 'omikujiSet',
      label: 'アクション設定',
      icon: 'ListChecks',
      description: 'コメントで実行するおみくじの設定',
      component: 'omikujiSet',
    },
  ],
  timers: [
    {
      section: 'baseSettings',
      label: '基本設定',
      icon: 'SlidersHorizontal',
      description: 'タイマーイベントの基本設定',
      component: 'baseSettings',
    },
    {
      section: 'timerInterval',
      label: 'タイマー設定',
      icon: 'Clock',
      description: '発動する間隔やタイミングの設定',
      component: 'timerInterval',
    },
    {
      section: 'omikujiSet',
      label: 'アクション設定',
      icon: 'ListChecks',
      description: 'おみくじの抽選設定や、おみくじの内容です',
      component: 'omikujiSet',
    },
  ],
  metas: [
    {
      section: 'baseSettings',
      label: '基本設定',
      icon: 'SlidersHorizontal',
      description: 'サービスイベントの基本設定',
      component: 'baseSettings',
    },
    {
      section: 'trigger',
      label: '発動条件',
      icon: 'Filter',
      description: '「おみくじを引く」発動条件の設定',
      component: 'trigger',
    },
    {
      section: 'omikujiSet',
      label: 'アクション設定',
      icon: 'ListChecks',
      description: 'おみくじの抽選設定や、おみくじの内容です',
      component: 'omikujiSet',
    },
  ],
  reactions: [
    {
      section: 'baseSettings',
      label: '基本設定',
      icon: 'SlidersHorizontal',
      description: 'リアクションイベントの基本設定',
      component: 'baseSettings',
    },
    {
      section: 'trigger',
      label: '発動条件',
      icon: 'Filter',
      description: '「おみくじを引く」発動条件の設定',
      component: 'trigger',
    },
    {
      section: 'omikujiSet',
      label: 'アクション設定',
      icon: 'ListChecks',
      description: 'おみくじの抽選設定や、おみくじの内容です',
      component: 'omikujiSet',
    },
  ],

  // ── リソース系 ─────────────────────────────────────────
  actionSets: [
    {
      section: 'baseSettings',
      label: '基本設定',
      icon: 'SlidersHorizontal',
      description: 'アクションセットの基本設定',
      component: 'baseSettings',
    },
    {
      section: 'omikujiSet',
      label: 'アクション設定',
      icon: 'ListChecks',
      description: 'コメントで実行するおみくじの設定',
      component: 'actionSet',
    },
  ],
  placeholders: [
    {
      section: 'baseSettings',
      label: '基本設定',
      icon: 'SlidersHorizontal',
      description: 'プレースホルダーの基本設定',
      component: 'baseSettings',
    },
    {
      section: 'placeholder',
      label: 'プレースホルダー設定',
      icon: 'Brackets',
      description: '抽選するプレースホルダーを編集します',
      component: 'placeholder',
    },
  ],
  characters: [
    {
      section: 'baseSettings',
      label: '基本設定',
      icon: 'SlidersHorizontal',
      description: 'キャラクターの基本設定',
      component: 'baseSettings',
    },
    {
      section: 'colorSettings',
      label: 'フキダシカラー設定',
      icon: 'Palette',
      description: 'フキダシのカラー編集を行います',
      component: 'colorSettings',
    },
    {
      section: 'commentVoice',
      label: 'BOTコメント表現設定',
      icon: 'MessageSquare',
      description: 'BOTコメントを読み上げる方法を指定します',
      component: 'commentVoice',
    },
    {
      section: 'imageSettings',
      label: 'ジェネレーター用画像設定',
      icon: 'Image',
      description: 'ジェネレーターで表示する画像の設定',
      component: 'imageSettings',
    },
  ],

  // ── appInfo（AppInfoEditor.vue の SectionCard#id から "section-" を除いたもの） ──
  appInfo: [
    { section: 'appSettings', label: 'アプリ設定', icon: 'Settings' },
    { section: 'appFeatures', label: '利用可能な機能', icon: 'Sparkles' },
    { section: 'packageBasic', label: '基本情報', icon: 'Info' },
    { section: 'packageDistribution', label: '配布情報', icon: 'Package' },
    { section: 'packageSystem', label: 'システム情報', icon: 'Cpu' },
  ],

  // jsonMerge: サブアイテム単位でセクションなし（そのまま）
  jsonMerge: [],
  components: [],
  dataPacks: [],
}
