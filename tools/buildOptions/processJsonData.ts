// tools/buildOptions/processJsonData.ts
import { OmikujiDataType, recordCategoryLabel, RecordCategoryType } from '@/types/OmikujiData/'
import { getKey } from '@/common/FeatureAccess/SettingMode'
import { AccessLevelLabels, AccessLevelType } from '@shared/types'

/**
 * JSONデータを読み込み、前処理を行う関数
 */
export const generateAccessLevelData = (data: OmikujiDataType, targetLevel?: AccessLevelType): OmikujiDataType => {
  if (!targetLevel || targetLevel === 'none') return data
  const targetIndex = AccessLevelLabels.indexOf(targetLevel)

  const filtered = Object.fromEntries(
    recordCategoryLabel.map((category) => [category, filterItems(data[category], targetIndex)])
  ) as Pick<OmikujiDataType, RecordCategoryType>

  return {
    ...data,
    ...filtered,
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
