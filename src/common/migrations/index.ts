// src/migrations/index.ts
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { APP_VERSION, DATA_VERSION } from '@/version'
import { migrateV100ToV130 } from './v1_to_v2/migrateV100ToV130'
import { migrateV130ToV200 } from './v1_to_v2/migrateV130ToV200'
import { resolveSettingMode } from '@/common/FeatureAccess/SettingMode'
import { getAvailableScripts } from '@game/GameScriptsRules'
import { getAvailableComponents } from '@config/components/componentEditor/componentRules'
import Swal from 'sweetalert2'

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

  // 読み込むデータが現在よりも新しい場合
  const incomingVersion = (data as any)?.meta?.dataVersion ?? 1
  if (incomingVersion > DATA_VERSION) {
    Swal.fire({
      icon: 'error',
      title: '読み込みエラー',
      text: `このデータは v${incomingVersion} 形式です。\nこのアプリ（v${DATA_VERSION}）では読み込めません。`,
    })
    throw new Error(`このデータは v${incomingVersion} 形式のため、このアプリ（v${DATA_VERSION}）では読み込めません。`)
  }

  // dataVersionを数値として取得。存在しない場合はv1と見なす。
  const currentDataVersion = (data as any)?.meta?.dataVersion ?? 1

  // まずは生データをそのまま使う
  let updatedData: any = { ...data }

  // v1 -> v1.3
  if (currentDataVersion < 1.3) {
    console.log('Migrating data from v1 to v1.3...')
    updatedData = migrateV100ToV130(updatedData)
  }

  // v1.3 -> v2
  if (currentDataVersion < 2) {
    console.log('Migrating data from v1.3 to v2...')
    updatedData = migrateV130ToV200(updatedData)
  }

  // スキーマで保証
  const hoge = OmikujiDataSchema.parse({
    ...updatedData,
    meta: {
      ...updatedData.meta,
      generatorVersion: APP_VERSION,
      dataVersion: DATA_VERSION,
    },
  })

  // PRO,GOD-MODE だったときの FeatureUsageSchema 変更(Advは変更なし)
  const licenseKeyHash = hoge.settings.licenseKeyHash
  const license = resolveSettingMode(licenseKeyHash)
  hoge.featureUsage.components = getAvailableComponents(license, hoge.featureUsage.components)
  hoge.featureUsage.gameScripts = getAvailableScripts(license, hoge.featureUsage.gameScripts)

  return hoge
}
