// src/migrations/index.ts
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { APP_VERSION, DATA_VERSION } from '@/config/version'
import { migrateV100ToV130 } from './v1_to_v2/OmikujiDataV1/migrateV100ToV130'
import { migrateV130ToV200 } from './v1_to_v2/OmikujiDataV1/migrateV130ToV200'

/**
 * データを現在のアプリのバージョンに合わせてマイグレーションする
 */
export function normalizeData(data: unknown): OmikujiDataType {
  
  // データにメタ情報がなければ、初期データとして扱う
  if (!data || typeof data !== 'object' || !('meta' in data)) {
    // OmikujiDataSchemaのデフォルト値を返す
    return OmikujiDataSchema.parse({
      meta: {
        generatorName: 'omikuji-bot',
        generatorVersion: APP_VERSION,
        dataVersion: DATA_VERSION,
      },
    })
  }

  // dataVersionを数値として取得。存在しない場合はv1と見なす。
  const currentDataVersion = (data as any)?.meta?.dataVersion ?? 1

  // まずは生データをそのまま使う
  let updatedData: any = { ...data }

  if (currentDataVersion < 1.3) {
    console.log('Migrating data from v1 to v1.3...')
    updatedData = migrateV100ToV130(updatedData)
  }

  if (currentDataVersion < 2) {
    console.log('Migrating data from v1 to v2...')
    updatedData = migrateV130ToV200(updatedData)
  }

  // 最後にスキーマで保証
  return OmikujiDataSchema.parse({
    ...updatedData,
    meta: {
      ...updatedData.meta,
      generatorVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
    },
  })
}
