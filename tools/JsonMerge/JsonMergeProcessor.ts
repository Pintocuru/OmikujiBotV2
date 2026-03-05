// tools/JsonMerge/JsonMergeProcessor.ts
import type { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { applyAccessLevel, applyOrderOffset } from './transforms'
import { applyRemaps } from './remaps'
import { loadSourceFile } from './fileLoader'
import { mergeOmikujiData } from './merger'
import { applyKeySuffix } from './KeySuffix'
import { findJsonPath } from '../buildOptions/baseSettings'

/**
 * jsonMergeがある場合にマージ処理を実行
 */
export async function processMerge(jsonData: OmikujiDataType, jsonPathRoot: string): Promise<OmikujiDataType> {
  // マージ設定がない場合はそのまま返す
  if (!jsonData.jsonMerge || jsonData.jsonMerge.length === 0) {
    return jsonData
  }

  const dataToMerge: OmikujiDataType[] = []
  let orderOffset = 0

  // 各マージアイテムについて、ファイル読み込み→リマップ→順序付与→accessLevel統一を実行
  for (const mergeItem of jsonData.jsonMerge) {
    // 1. ソースファイルを読み込む
    const resolvedSourcePath = findJsonPath(jsonPathRoot, mergeItem.sourceFile)
    const sourceData = loadSourceFile(resolvedSourcePath, jsonPathRoot)

    // 2. リマップ処理を適用（characterKey, iconKeyの置き換え）
    const remappedData = applyRemaps(sourceData, mergeItem.remaps)

    // 各キーに接尾辞を付与
    const suffixedData = applyKeySuffix(remappedData, mergeItem.keySuffix)

    // 3. 再帰的にマージ処理（ソースファイルにもjsonMergeがある場合）
    const processedSourceData = await processMerge(suffixedData, jsonPathRoot)

    // 4. accessLevelを強制統一
    const unifiedAccessLevelData = applyAccessLevel(processedSourceData, mergeItem.accessLevel)

    // 5. orderに +100 * index を付与して競合を防止
    orderOffset += 100
    const shiftedOrderData = applyOrderOffset(unifiedAccessLevelData, orderOffset)

    dataToMerge.push(shiftedOrderData)
  }

  // メインデータの order も最後にずらす
  const { jsonMerge: _jsonMerge, ...dataWithoutMerge } = jsonData
  const shiftedMainData = applyOrderOffset({ ...dataWithoutMerge, jsonMerge: [] }, orderOffset)

  dataToMerge.push({ ...shiftedMainData, jsonMerge: [] })

  // すべてをマージ
  return mergeOmikujiData(...dataToMerge)
}
