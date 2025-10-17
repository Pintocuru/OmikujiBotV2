// src/migrations/index.ts
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { APP_VERSION, DATA_VERSION } from '@/config/version'

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

  // メタ情報を最新バージョンに更新
  let parsedData = OmikujiDataSchema.parse(data)
  let updatedData: OmikujiDataType = {
    ...parsedData,
    meta: {
      ...parsedData.meta,
      generatorVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
    },
  }

  // バージョン
  if (currentDataVersion < 1.3) {
    console.log('Migrating data from v1 to v1.3...')
    updatedData = migrateV1ToV13(updatedData)
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

/**
 * v1からv1.3へのマイグレーション
 * omikuji配列内のオブジェクトのkeyが空文字の場合、idをコピーする
 */
function migrateV1ToV13(data: OmikujiDataType): OmikujiDataType {
  const migratedData = { ...data }

  // comments のマイグレーション
  if (migratedData.comments) {
    Object.keys(migratedData.comments).forEach((commentKey) => {
      const comment = migratedData.comments[commentKey]
      if (comment?.omikuji && Array.isArray(comment.omikuji)) {
        comment.omikuji = comment.omikuji.map((item) => {
          // keyが空文字またはundefinedの場合、idをコピー
          if (!item.key || item.key.trim() === '') {
            return {
              ...item,
              key: item.id,
            }
          }
          return item
        })
      }
    })
  }

  // timers のマイグレーション
  if (migratedData.timers) {
    Object.keys(migratedData.timers).forEach((timerKey) => {
      const timer = migratedData.timers[timerKey]
      if (timer?.omikuji && Array.isArray(timer.omikuji)) {
        timer.omikuji = timer.omikuji.map((item) => {
          // keyが空文字またはundefinedの場合、idをコピー
          if (!item.key || item.key.trim() === '') {
            return {
              ...item,
              key: item.id,
            }
          }
          return item
        })
      }
    })
  }

  console.log('Migration to v1.3 completed: omikuji keys補完完了')
  return migratedData
}
