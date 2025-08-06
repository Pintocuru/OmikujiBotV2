// src/types/CategoryType.ts
import {
 countUnitCondition,
 countUnitConditionLabels,
 serviceMetaCondition,
 serviceMetaConditionLabels
} from '@shared/types/';
import { MessageCircle, Timer, Hash, Settings, Users, Monitor, ListChecks } from 'lucide-vue-next';

/**
 * デフォルトで利用可能なプレースホルダーの定数配列
 */
export const defaultPlaceholders = [
 'user',
 'price',
 ...countUnitCondition,
 ...serviceMetaCondition
] as const;

/**
 * デフォルトプレースホルダーの型定義
 */
export type DefaultPlaceholders = (typeof defaultPlaceholders)[number];

/**
 * デフォルトプレースホルダーの日本語ラベル定義
 */
export const defaultPlaceholdersLabels: Record<DefaultPlaceholders, string> = {
 user: 'コメントしたユーザー',
 price: 'ギフト金額',
 ...countUnitConditionLabels,
 ...serviceMetaConditionLabels
};

/**
 * 選択可能なカテゴリタイプの定数配列
 */
export const selectCategoryType = ['comments', 'timers', 'placeholders', 'characters'] as const;

/**
 * 選択可能なカテゴリタイプの型定義
 */
export type SelectCategoryType = (typeof selectCategoryType)[number];

/**
 * すべてのカテゴリタイプの定数配列
 */
export const categoryType = [
 ...selectCategoryType,
 'scriptSettings',
 'displaySettings',
 'wordPartySettings'
] as const;

/**
 * カテゴリタイプの型定義
 */
export type CategoryType = (typeof categoryType)[number];

/**
 * 各カテゴリのラベル、説明、アイコン定義
 */
export const categoryLabels: Record<
 CategoryType,
 { label: string; description: string; icon: any }
> = {
 comments: {
  label: 'コメントルール',
  description: 'チャットの内容やユーザー情報でおみくじを発火します',
  icon: MessageCircle
 },
 timers: {
  label: 'タイマールール',
  description: '時間経過で自動的におみくじを発火します',
  icon: Timer
 },
 placeholders: {
  label: 'プレースホルダー',
  description: 'コメント・タイマーで補助的に使用する、高性能なプレースホルダー',
  icon: Hash
 },
 characters: {
  label: 'キャラクター',
  description: 'BOTメッセージで使用するキャラクターアイコンや、カラーを設定します',
  icon: Users
 },
 scriptSettings: {
  label: 'ゲームスクリプト',
  description: 'ゲームスクリプトを動かし、特殊なプレースホルダーを生成するための初期設定',
  icon: Settings
 },
 displaySettings: {
  label: '表示設定',
  description: 'BOTメッセージやランキングの表示・非表示を設定します',
  icon: Monitor
 },
 wordPartySettings: {
  label: 'WordPartyリスト',
  description: 'コメント・タイマーの設定時に補助的に使える、WordPartyリスト。',
  icon: ListChecks
 }
};
