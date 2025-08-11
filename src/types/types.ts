// src/types.ts
import { OmikujiDataType } from './OmikujiData/OmikujiDataSchema';
import { ConfigUserType } from '@shared/types/';

// 開発版・本番で値が異なるもの
export const isDev = import.meta.env?.VITE_IS_DEV || false;
const imageBaseUrl = import.meta.env?.VITE_IMAGE_BASE_URL || './Characters/';
export const getImagePath = (profileImage?: string) => {
 return profileImage ? `${imageBaseUrl}${profileImage}` : '';
};

// ---

// グローバル変数の型定義
declare global {
 interface Window {
  userConfig?: ConfigUserType;
  omikujiData?: OmikujiDataType;
 }
}
