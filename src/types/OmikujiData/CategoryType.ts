// src/types/CategoryType.ts
import {
 countUnitCondition,
 countUnitConditionLabels,
 serviceMetaCondition,
 serviceMetaConditionLabels
} from '@shared/types/';
import { MessageCircle, Timer, Hash, Settings, Users, Monitor, ListChecks } from 'lucide-vue-next';
import { CommentRuleType, RuleType, TimerRuleType } from './OmikujiDataSchema';
import { PlaceholderType } from './PlaceholderSchema';
import { CharacterType } from './CharacterSchema';

// デフォルトで利用可能なプレースホルダーの定数配列
export const defaultPlaceholders = [
 'user',
 'price',
 ...countUnitCondition,
 ...serviceMetaCondition
] as const;

// デフォルトプレースホルダーの型定義
export type DefaultPlaceholders = (typeof defaultPlaceholders)[number];

// デフォルトプレースホルダーの日本語ラベル定義
export const defaultPlaceholdersLabels: Record<DefaultPlaceholders, string> = {
 user: 'コメントしたユーザー',
 price: 'ギフト金額',
 ...countUnitConditionLabels,
 ...serviceMetaConditionLabels
};

// 選択可能なカテゴリタイプの定数配列
export const recordCategoryLabel = ['comments', 'timers', 'placeholders', 'characters'] as const;

// 選択可能なカテゴリタイプの型定義
export type RecordCategoryType = (typeof recordCategoryLabel)[number];
export type RecordCategoryUnion = RuleType | PlaceholderType | CharacterType;
export type RecordCategoryTypeMap = {
 comments: CommentRuleType;
 timers: TimerRuleType;
 placeholders: PlaceholderType;
 characters: CharacterType;
};

// settingsCategory なカテゴリタイプの型定義
export const settingsCategoryType = [
 'scriptSettings',
 'displaySettings',
 'wordPartySettings'
] as const;
export type SettingsCategoryType = (typeof settingsCategoryType)[number];

/**
 * すべてのカテゴリタイプを定義する定数配列
 * @description RecordCategoryTypeにscriptSettings, displaySettings, wordPartySettingsを追加
 */
export const categoryType = [...recordCategoryLabel, ...settingsCategoryType] as const;
export type CategoryType = (typeof categoryType)[number];

/**
 * 各カテゴリのラベル、説明、アイコンを定義するオブジェクト
 * @description コメントルール、タイマールールなどの設定項目を定義
 */
export const categoryLabels: Record<
 CategoryType,
 { label: string; description: string; icon: any }
> = {
 comments: {
  label: 'コメントルール', // チャットの内容やユーザー情報でおみくじを発火
  description: 'チャットの内容やユーザー情報でおみくじを発火します',
  icon: MessageCircle
 },
 timers: {
  label: 'タイマールール', // 時間経過で自動的におみくじを発火
  description: '時間経過で自動的におみくじを発火します',
  icon: Timer
 },
 placeholders: {
  label: 'プレースホルダー', // コメント・タイマーで補助的に使用
  description: 'コメント・タイマーで補助的に使用する、高性能なプレースホルダー',
  icon: Hash
 },
 characters: {
  label: 'キャラクター', // BOTメッセージで使用するアイコンやカラー
  description: 'BOTメッセージで使用するキャラクターアイコンや、カラーを設定します',
  icon: Users
 },
 scriptSettings: {
  label: 'ゲームスクリプト', // 特殊なプレースホルダーを生成するための初期設定
  description: 'ゲームスクリプトを動かし、特殊なプレースホルダーを生成するための初期設定',
  icon: Settings
 },
 displaySettings: {
  label: '表示設定', // BOTメッセージやランキングの表示・非表示
  description: 'BOTメッセージやランキングの表示・非表示を設定します',
  icon: Monitor
 },
 wordPartySettings: {
  label: 'WordPartyリスト', // コメント・タイマーの設定時に補助的に使える
  description: 'コメント・タイマーの設定時に補助的に使える、WordPartyリスト。',
  icon: ListChecks
 }
};
