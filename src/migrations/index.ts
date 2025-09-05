// src\migrations\index.ts
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'

/**
 * データを現在のアプリのバージョンに合わせてマイグレーションする
 * @param data マイグレーション前のデータ
 * @returns マイグレーション後のデータ
 */
export function migrate(data: unknown): OmikujiDataType {
  let migratedData = data

  // データにメタ情報がなければ、初期データとして扱う
  if (!migratedData || typeof migratedData !== 'object' || !('meta' in migratedData)) {
    // OmikujiDataSchemaのデフォルト値を返す
    return OmikujiDataSchema.parse({})
  }

  // dataVersionを数値として取得。存在しない場合はv1と見なす。
  const currentDataVersion = (migratedData as any)?.meta?.dataVersion ?? 1

  /*
  // v1からv2へのマイグレーションを実行
  if (currentDataVersion < 2) {
    console.log('Migrating data from v1 to v2...')
    migratedData = migrateV1ToV2(migratedData)
  }
  */

  // 将来的なバージョンアップのために、ここに処理を追加できる
  // if (currentDataVersion < 3) {
  //   migratedData = migrateV2ToV3(migratedData);
  // }

  return migratedData as OmikujiDataType
}
