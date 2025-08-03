// src/types.ts
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { OmikujiDataType } from './OmikujiDataSchema';
import { CharacterColorScheme } from './OmikujiBot/CharacterSchema';
import { ConfigUserType } from '@shared/types/';

// BotMessage Commentを大幅に略したもの
export const BotMessageSchema = z.object({
 id: z
  .string()
  .default(() => uuidv4())
  .catch(() => uuidv4()), // ID
 name: z.string().catch('error'), // 名前
 profileImage: z.string().nullable().catch(null), // アイコン
 timestamp: z
  .string()
  .default(() => new Date().toISOString())
  .catch(() => new Date().toISOString()), // 投稿日時
 comment: z.string().catch('error'), // コメント
 isToast: z.boolean().catch(false), // 通常表示かトースト表示か
 color: CharacterColorScheme.catch(CharacterColorScheme.parse({})), // カラー
 delaySeconds: z.number().default(0).catch(0) // 投稿までの遅延時間（秒）
});
export type BotMessage = z.infer<typeof BotMessageSchema>;

// ---

// 開発版・本番で値が異なるもの
export const isDev = import.meta.env?.VITE_IS_DEV || false;
const imageBaseUrl = import.meta.env?.VITE_IMAGE_BASE_URL || './Characters/';
export const getImagePath = (profileImage: string) => `${imageBaseUrl}${profileImage}`;

// ---

// グローバル変数の型定義
declare global {
 interface Window {
  userConfig?: ConfigUserType;
  omikujiData?: OmikujiDataType;
 }
}
