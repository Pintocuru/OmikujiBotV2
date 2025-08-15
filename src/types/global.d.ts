// src\types\global.d.ts
import { OmikujiDataType } from './OmikujiData/OmikujiDataSchema'
import { ConfigUserType } from '@shared/types/'

// グローバル変数の型定義
declare global {
  interface Window {
    userConfig?: ConfigUserType
    omikujiData?: OmikujiDataType
  }
}
