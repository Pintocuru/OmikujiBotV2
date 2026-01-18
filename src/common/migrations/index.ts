// src/migrations/index.ts
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { OmikujiDataSchema as OmikujiDataSchemaV200 } from './v1_to_v2/OmikujiDataV200/OmikujiDataSchema'
import { APP_VERSION, DATA_VERSION } from '@/version'
import { migrateV100ToV130 } from './v1_to_v2/migrateV100ToV130'
import { migrateV130ToV200 } from './v1_to_v2/migrateV130ToV200'
import { resolveSettingMode } from '@/common/FeatureAccess/SettingMode'
import { getAvailableScripts } from '@game/GameScriptsRules'
import { getAvailableComponents } from '@config/components/componentEditor/componentRules'
import { swalToast } from '../SweetAlert2/SweetAlert2Toast'
import { isDev } from '@/types'

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
    const msg = `このデータは v${incomingVersion} 形式です。\nこのアプリ（v${DATA_VERSION}）では読み込めません。`
    swalToast.error({ title: '読み込みエラー', text: msg })
    throw new Error(msg)
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

    // v1 > v2 のWelcomeトースト
    swalToast.success({ title: 'Welcome to v2!', text: 'データが v2 形式にアップグレードされました。' })
  }

  // v2.0.0 → v2.0.1
  if (currentDataVersion < 2.01) {
    console.log('Migrating data: v2.0.0 → v2.0.1')
    updatedData = OmikujiDataSchemaV200.parse(updatedData)
    updatedData.meta.dataVersion = 2.01
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
  if (isDev) return hoge // devなら変更を行わない

  const licenseKeyHash = hoge.settings.licenseKeyHash
  const license = resolveSettingMode(licenseKeyHash)
  hoge.featureUsage.components = getAvailableComponents(license, hoge.featureUsage.components)
  hoge.featureUsage.gameScripts = getAvailableScripts(license, hoge.featureUsage.gameScripts)

  return hoge
}
