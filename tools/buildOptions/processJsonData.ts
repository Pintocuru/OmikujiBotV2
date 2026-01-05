// tools\buildOptions\processJsonData.ts
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { getKey } from '@/common/FeatureAccess/SettingMode'
import { AccessLevelLabels, AccessLevelType } from '@shared/types'

/**
 * JSONデータを読み込み、前処理を行う関数
 * @param config ビルド設定オブジェクト
 * @returns 前処理後のビルド設定オブジェクト
 */
export const generateAccessLevelData = (data: OmikujiDataType, targetLevel?: AccessLevelType): OmikujiDataType => {
  // none なら、フィルタリングしない
  if (!targetLevel || targetLevel === 'none') return data
  const targetIndex = AccessLevelLabels.indexOf(targetLevel)

  return {
    ...data,
    comments: filterItems(data.comments, targetIndex),
    timers: filterItems(data.timers, targetIndex),
    placeholders: filterItems(data.placeholders, targetIndex),
    characters: filterItems(data.characters, targetIndex),
    settings: {
      ...data.settings,
      licenseKeyHash: getKey(targetLevel),
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
