// test

/**
import {  OmikujiDataTypeV1 } from '../types/schemas' // v1のスキーマも必要
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'


v1データをv2形式にマイグレーションする関数
export function migrateV1ToV2(data: unknown): OmikujiDataType {

// データをv1の最終版スキーマに通す
// 実装

// V1 -> V2 へのマイグレーション
const v2Data = {
    ...data,
    meta: {
      ...data.meta,
      // ここで appVersion, dataVersion を設定
      appVersion: '2.0.0',
      dataVersion: 2,
    },
    // baseスキーマの分割など、具体的な変換ロジック
    base: {
      bubble: {
        displaySize: data.base.displaySize,
        fontFamily: data.base.fontFamily,
        // ...
      },
      // ...他の分割されたスキーマ
    },
  }
  return v2Data
}

 */
