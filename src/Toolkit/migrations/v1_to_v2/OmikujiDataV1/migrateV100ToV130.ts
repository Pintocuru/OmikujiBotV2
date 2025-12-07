// src\Toolkit\migrations\v1_to_v2\OmikujiDataV1\migrateV1ToV13.ts
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'

/**
 * v1からv1.3へのマイグレーション
 * omikuji配列内のオブジェクトのkeyが空文字の場合、idをコピーする
 */
export function migrateV100ToV130(data: OmikujiDataType): OmikujiDataType {
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
