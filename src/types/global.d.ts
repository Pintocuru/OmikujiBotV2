// src/types/global.d.ts
import type { OmikujiDataType } from './OmikujiData/OmikujiDataSchema'
import type { ConfigUserType } from '@shared/types/'

// グローバル変数の型定義
declare global {
  interface Window {
    omikujiData?: OmikujiDataType
  }
}
