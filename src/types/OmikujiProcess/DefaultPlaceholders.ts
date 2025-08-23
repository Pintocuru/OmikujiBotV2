// src\types\OmikujiProcess\DefaultPlaceholders.ts
import {
  countUnitCondition,
  countUnitConditionLabels,
  serviceMetaCondition,
  serviceMetaConditionLabels,
} from '@shared/types/'

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
