// types\OmikujiData\CategoryType.ts
import { PlaceholderSchema, PlaceholderType } from './PlaceholderSchema'
import { CharacterSchema, CharacterType } from './CharacterSchema'
import {
  CommentRuleSchema,
  CommentRuleType,
  rulesCategoryLabel,
  RulesCategoryType,
  RuleType,
  TimerRuleSchema,
  TimerRuleType,
} from './RulesSchema'
import { MessageSquare, Timer, Brackets, Users, LayoutGrid, Info, Zap, Layers } from 'lucide-vue-next'
import { ActionSetSchema, PostActionRecordType } from './OmikujiSchema'

/**
 * RecordCategory
 */
export const recordCategoryLabel = [...rulesCategoryLabel, 'actionSets', 'placeholders', 'characters'] as const
export type RecordCategoryType = (typeof recordCategoryLabel)[number]
export type RecordCategoryUnion = RuleType | PlaceholderType | CharacterType
export type RecordCategoryDataMap = {
  comments: Record<string, CommentRuleType>
  timers: Record<string, TimerRuleType>
  actionSets: Record<string, PostActionRecordType>
  placeholders: Record<string, PlaceholderType>
  characters: Record<string, CharacterType>
}
export type RecordCategoryItemTypeMap = {
  comments: CommentRuleType
  timers: TimerRuleType
  actionSets: PostActionRecordType
  placeholders: PlaceholderType
  characters: CharacterType
}

// カテゴリ更新用のスキーママップ
export const RecordCategorySchemaMap = {
  comments: CommentRuleSchema,
  timers: TimerRuleSchema,
  actionSets: ActionSetSchema,
  placeholders: PlaceholderSchema,
  characters: CharacterSchema,
} as const

export const isRulesCategory = (category: CategoryType): category is RulesCategoryType => {
  return rulesCategoryLabel.includes(category as RulesCategoryType)
}

/**
 * settingsCategory
 */
export const settingsCategoryLabel = ['jsonMerge', 'components', 'appInfo'] as const
export type SettingsCategoryType = (typeof settingsCategoryLabel)[number]

/**
 * CategoryType
 */
export const categoryType = [...recordCategoryLabel, ...settingsCategoryLabel] as const
export type CategoryType = (typeof categoryType)[number]

// 各カテゴリのラベル、説明、アイコンを定義
export const categoryLabels: Record<CategoryType, { label: string; description: string; icon: any }> = {
  jsonMerge: {
    label: 'JSONマージ(Dev)',
    description: 'ビルド時、jsonファイルをマージして出力します',
    icon: Layers,
  },
  comments: {
    label: 'コメントルール', // チャットの内容やユーザー情報でおみくじを発動
    description: 'チャット内容やユーザー情報を基におみくじを発動します',
    icon: MessageSquare,
  },
  timers: {
    label: 'タイマールール', // 時間経過で自動的におみくじを発動
    description: '指定した時間経過で、自動的におみくじを発動します',
    icon: Timer,
  },
  actionSets: {
    label: 'アクションセット',
    description: 'BOTのコメント・WordPartyの指定のプリセットを作成します',
    icon: Zap,
  },
  placeholders: {
    label: 'プレースホルダー', // コメント・タイマーで補助的に使用
    description: 'コメントやタイマーで利用できる、高性能なプレースホルダーを設定します',
    icon: Brackets,
  },
  characters: {
    label: 'キャラクター', // BOTメッセージで使用するアイコンやカラー
    description: 'BOTメッセージのキャラクターや吹き出し・トーストの色を設定します',
    icon: Users,
  },
  components: {
    label: 'コンポーネント', // BOTメッセージやランキングの表示・非表示
    description: 'ジェネレーターで表示できる、コンポーネントの設定を行います',
    icon: LayoutGrid,
  },
  appInfo: {
    label: 'アプリ情報',
    description: 'ライセンスや使用できる機能を確認できます',
    icon: Info,
  },
}
