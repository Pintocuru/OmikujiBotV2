// tools\buildOptions\processJsonData.ts
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { getKey } from '@/types/SettingMode'
import { AccessLevelLabels, AccessLevelType } from '@shared/types'

/**
 * JSONデータを読み込み、前処理を行う関数
 * @param config ビルド設定オブジェクト
 * @returns 前処理後のビルド設定オブジェクト
 */
export const generateAccessLevelData = (data: OmikujiDataType, targetLevel?: AccessLevelType): OmikujiDataType => {
  // experimental なら、フィルタリングしない
  if (!targetLevel || targetLevel === 'experimental') return data
  const targetIndex = AccessLevelLabels.indexOf(targetLevel)

  return {
    ...data,
    comments: filterItems(data.comments, targetIndex),
    timers: filterItems(data.timers, targetIndex),
    placeholders: filterItems(data.placeholders, targetIndex),
    characters: filterItems(data.characters, targetIndex),
    displaySettings: {
      ...data.displaySettings,
      editor: {
        ...data.displaySettings.editor,
        licenseKeyHash: getLicenseKeyHash(targetLevel),
      },
    },
  }
}

// 汎用的なフィルタリング関数
const filterItems = <T extends Record<string, any>>(data: T, targetIndex: number): T => {
  const filteredData: T = {} as T
  for (const key in data) {
    const item = data[key]
    const itemAccessLevel: AccessLevelType = item.accessLevel || 'basic'
    const itemIndex = AccessLevelLabels.indexOf(itemAccessLevel)
    if (itemIndex <= targetIndex) filteredData[key] = item
  }
  return filteredData
}

// License書き換え
const getLicenseKeyHash = (targetLevel?: AccessLevelType): string => {
  // 未記入ならbasic
  if (!targetLevel) return ''

  if (targetLevel === 'pro') return getKey('pro')
  if (targetLevel === 'internal') return getKey('godMode')

  return ''
}
