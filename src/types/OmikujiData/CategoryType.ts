// types\OmikujiData\CategoryType.ts
import { PlaceholderType } from './PlaceholderSchema'
import { CharacterType } from './CharacterSchema'
import { CommentRuleType, rulesCategoryLabel, RuleType, TimerRuleType } from './RulesSchema'
import {
  countUnitCondition,
  countUnitConditionLabels,
  serviceMetaCondition,
  serviceMetaConditionLabels,
} from '@shared/types/'
import { MessageCircle, Timer, Hash, Settings, Users, Monitor, ListChecks, Tags } from 'lucide-vue-next'

// デフォルトで利用可能なプレースホルダーの定数配列
export const defaultPlaceholders = ['user', 'price', ...countUnitCondition, ...serviceMetaCondition] as const

// デフォルトプレースホルダーの型定義
export type DefaultPlaceholders = (typeof defaultPlaceholders)[number]

// デフォルトプレースホルダーの日本語ラベル定義
export const defaultPlaceholdersLabels: Record<DefaultPlaceholders, string> = {
  user: 'コメントしたユーザー',
  price: 'ギフト金額',
  ...countUnitConditionLabels,
  ...serviceMetaConditionLabels,
}

// 選択可能なカテゴリタイプの定数配列
export const recordCategoryLabel = [...rulesCategoryLabel, 'placeholders', 'characters'] as const
export type RecordCategoryType = (typeof recordCategoryLabel)[number]
export type RecordCategoryUnion = RuleType | PlaceholderType | CharacterType
export type RecordCategoryTypeMap = {
  comments: CommentRuleType
  timers: TimerRuleType
  placeholders: PlaceholderType
  characters: CharacterType
}

// settingsCategory なカテゴリタイプの型定義
export const settingsCategoryType = ['scriptSettings', 'displaySettings', 'wordPartySettings', 'meta'] as const
export type SettingsCategoryType = (typeof settingsCategoryType)[number]

/**
 * すべてのカテゴリタイプを定義する定数配列
 * @description RecordCategoryTypeにscriptSettings, displaySettings, wordPartySettingsを追加
 */
export const categoryType = [...recordCategoryLabel, ...settingsCategoryType] as const
export type CategoryType = (typeof categoryType)[number]

/**
 * 各カテゴリのラベル、説明、アイコンを定義するオブジェクト
 * @description コメントルール、タイマールールなどの設定項目を定義
 */
export const categoryLabels: Record<CategoryType, { label: string; description: string; icon: any }> = {
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
  scriptSettings: {
    label: 'ゲームスクリプト', // 特殊なプレースホルダーを生成するための初期設定
    description: 'ゲームのモードや、ランキングの上限回数等の初期設定を行います',
    icon: Settings,
  },
  displaySettings: {
    label: '表示設定', // BOTメッセージやランキングの表示・非表示
    description: 'メッセージの文字の大きさや、トーストの表示設定を行います',
    icon: Monitor,
  },
  wordPartySettings: {
    label: 'WordPartyリスト', // コメント・タイマーの設定時に補助的に使える
    description: 'コメントやタイマー設定時に利用できる、WordPartyの発動リストを管理します',
    icon: ListChecks,
  },
  meta: {
    label: 'Metaタグ',
    description: 'このおみくじデータのメタ情報を設定します',
    icon: Tags,
  },
}
