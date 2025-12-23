// src\types\global.d.ts
import type { OmikujiDataType } from './OmikujiData/OmikujiDataSchema'
import type { ConfigUserType } from '@shared/types/'
import type { OneSDK } from '../../../../libs/onesdk/OneSDK'

// グローバル変数の型定義
declare global {
  interface Window {
    OneSDK?: OneSDK
    userConfig?: ConfigUserType
    omikujiData?: OmikujiDataType
  }
}
