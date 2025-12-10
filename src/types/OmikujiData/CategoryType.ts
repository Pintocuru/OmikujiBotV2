// types\OmikujiData\CategoryType.ts
import { PlaceholderSchema, PlaceholderType } from './PlaceholderSchema'
import { CharacterSchema, CharacterType } from './CharacterSchema'
import {
  CommentRuleSchema,
  CommentRuleType,
  rulesCategoryLabel,
  RuleType,
  TimerRuleSchema,
  TimerRuleType,
} from './RulesSchema'
import {
  MessageCircle,
  Timer,
  Hash,
  Settings,
  Users,
  Monitor,
  ListChecks,
  Tags,
  MessagesSquare,
  Layers,
} from 'lucide-vue-next'
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

/**
 * settingsCategory
 */
export const settingsCategoryLabel = [
  'jsonMerge',
  //  'scriptSettings',
  'displaySettings',
  //  'wordPartySettings',
  'meta',
] as const
export type SettingsCategoryType = (typeof settingsCategoryLabel)[number]

/**
 * CategoryType
 */
export const categoryType = [...recordCategoryLabel, ...settingsCategoryLabel] as const
export type CategoryType = (typeof categoryType)[number]

// 各カテゴリのラベル、説明、アイコンを定義
export const categoryLabels: Record<CategoryType, { label: string; description: string; icon: any }> = {
  jsonMerge: {
    label: 'JSONマージ(開発者専用)',
    description: 'ビルド時、jsonファイルをマージして出力します',
    icon: Layers,
  },
  comments: {
    label: 'コメントルール', // チャットの内容やユーザー情報でおみくじを発動
    description: 'チャット内容やユーザー情報を基におみくじを発動します',
    icon: MessageCircle,
  },
  timers: {
    label: 'タイマールール', // 時間経過で自動的におみくじを発動
    description: '指定した時間経過で、自動的におみくじを発動します',
    icon: Timer,
  },
  actionSets: {
    label: 'アクションセット',
    description: 'BOTのコメント・WordPartyの指定のプリセットを作成します',
    icon: MessagesSquare,
  },
  placeholders: {
    label: 'プレースホルダー', // コメント・タイマーで補助的に使用
    description: 'コメントやタイマーで利用できる、高性能なプレースホルダーを設定します',
    icon: Hash,
  },
  characters: {
    label: 'キャラクター(カラー設定)', // BOTメッセージで使用するアイコンやカラー
    description: 'BOTメッセージのキャラクターや吹き出し・トーストの色を設定します',
    icon: Users,
  },
  displaySettings: {
    label: '表示設定', // BOTメッセージやランキングの表示・非表示
    description: 'メッセージの文字の大きさや、トーストの表示設定を行います',
    icon: Monitor,
  },
  meta: {
    label: 'Metaタグ',
    description: 'このおみくじデータのメタ情報を設定します',
    icon: Tags,
  },
}

/**

  scriptSettings: {
    label: 'ゲームスクリプト', // 特殊なプレースホルダーを生成するための初期設定
    description: 'ゲームのモードや、ランキングの上限回数等の初期設定を行います',
    icon: Settings,
  },
  wordPartySettings: {
    label: 'WordPartyリスト', // コメント・タイマーの設定時に補助的に使える
    description: 'コメントやタイマー設定時に利用できる、WordPartyの発動リストを管理します',
    icon: ListChecks,
  },

*/
