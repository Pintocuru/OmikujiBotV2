// src/migrations/index.ts
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { APP_VERSION, DATA_VERSION } from '@/config/version'

/**
 * データを現在のアプリのバージョンに合わせてマイグレーションする
 * @param data マイグレーション前のデータ
 * @returns マイグレーション後のデータ
 */
// TODO: normalizeData って関数名はどうだろう?(バリデーションも行ってるので)
export function migrate(data: unknown): OmikujiDataType {
  // データにメタ情報がなければ、初期データとして扱う
  if (!data || typeof data !== 'object' || !('meta' in data)) {
    // OmikujiDataSchemaのデフォルト値を返す
    return OmikujiDataSchema.parse({
      meta: {
        generatorVersion: APP_VERSION,
        dataVersion: DATA_VERSION,
      },
    })
  }

  // dataVersionを数値として取得。存在しない場合はv1と見なす。
  const currentDataVersion = (data as any)?.meta?.dataVersion ?? 1

  // メタ情報を最新バージョンに更新
  const parsedData = OmikujiDataSchema.parse(data)
  const updatedData: OmikujiDataType = {
    ...parsedData,
    meta: {
      ...parsedData.meta,
      generatorVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
    },
  }

  /*
  // 将来的なマイグレーション処理
  if (currentDataVersion < 2) {
    console.log('Migrating data from v1 to v2...')
    updatedData = migrateV1ToV2(updatedData)
  }
  */

  return updatedData
}
