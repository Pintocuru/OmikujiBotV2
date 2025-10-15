// tools\JsonMerge\jsonMergeProcessor.ts
import fs from 'fs'
import path from 'path'
import type { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import type { JsonMergeRemapType } from '@/types/OmikujiData/JsonMergeType'
import type { PostActionType } from '@/types/OmikujiData/OmikujiSchema'

/**
 * メイン処理：jsonMergeがある場合にマージ処理を実行
 */
export async function processMerge(jsonData: OmikujiDataType, jsonPathRoot: string): Promise<OmikujiDataType> {
  if (!jsonData.jsonMerge || jsonData.jsonMerge.length === 0) {
    return jsonData
  }

  // マージ対象となるデータ配列を収集
  const dataToMerge: OmikujiDataType[] = []

  for (const mergeItem of jsonData.jsonMerge) {
    // ソースファイルを読み込み
    const sourceData = loadSourceFile(mergeItem.sourceFile, jsonPathRoot)

    // リマップ処理を適用
    const remappedData = applyRemaps(sourceData, mergeItem.remaps)

    // 再帰的にマージ処理（ソースファイルにもjsonMergeがある場合）
    const processedSourceData = await processMerge(remappedData, jsonPathRoot)

    dataToMerge.push(processedSourceData)
  }

  // 最後にupdatedJsonDataを追加（jsonMergeは除外）
  const { jsonMerge, ...dataWithoutMerge } = jsonData
  dataToMerge.push({ ...dataWithoutMerge, jsonMerge: [] })

  // すべてをマージ
  return mergeOmikujiData(...dataToMerge)
}

/**
 * ソースファイルを読み込む
 */
function loadSourceFile(sourceFile: string, jsonPathRoot: string): OmikujiDataType {
  const filePath = path.resolve(jsonPathRoot, sourceFile)

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(content) as OmikujiDataType
    console.log(`[JsonMerge] Loaded source file: ${filePath}`)
    return jsonData
  } catch (error) {
    throw new Error(`Failed to load source file: ${filePath}. Error: ${error}`)
  }
}

/**
 * PostActionの配列に対してリマップを適用
 */
function remapPostActions(postActions: PostActionType[], remaps: JsonMergeRemapType[]): PostActionType[] {
  return postActions.map((action) => {
    let remappedAction: PostActionType = { ...action }

    for (const remap of remaps) {
      // characterKeyの置き換え
      if (remap.fromCharacterKey && remap.toCharacterKey) {
        if (remappedAction.characterKey === remap.fromCharacterKey) {
          remappedAction = {
            ...remappedAction,
            characterKey: remap.toCharacterKey,
          }
        }
      }

      // iconKeyの置き換え
      if (remap.fromIconKey && remap.toIconKey) {
        if (remappedAction.iconKey === remap.fromIconKey) {
          remappedAction = {
            ...remappedAction,
            iconKey: remap.toIconKey as PostActionType['iconKey'],
          }
        }
      }
    }

    return remappedAction
  })
}

/**
 * リマップ処理を適用
 */
function applyRemaps(data: OmikujiDataType, remaps: JsonMergeRemapType[]): OmikujiDataType {
  if (!remaps || remaps.length === 0) {
    return data
  }

  const clonedData: OmikujiDataType = JSON.parse(JSON.stringify(data))

  // comments のリマップ
  if (clonedData.comments) {
    for (const key in clonedData.comments) {
      const comment = clonedData.comments[key]
      if (comment.omikuji) {
        comment.omikuji = comment.omikuji.map((item) => ({
          ...item,
          postActions: item.postActions ? remapPostActions(item.postActions, remaps) : [],
        }))
      }
    }
  }

  // timers のリマップ
  if (clonedData.timers) {
    for (const key in clonedData.timers) {
      const timer = clonedData.timers[key]
      if (timer.omikuji) {
        timer.omikuji = timer.omikuji.map((item) => ({
          ...item,
          postActions: item.postActions ? remapPostActions(item.postActions, remaps) : [],
        }))
      }
    }
  }

  // actionSets のリマップ
  if (clonedData.actionSets) {
    for (const key in clonedData.actionSets) {
      const actionSet = clonedData.actionSets[key]
      if (actionSet.postActions) {
        actionSet.postActions = remapPostActions(actionSet.postActions, remaps)
      }
    }
  }

  console.log(`[JsonMerge] Applied ${remaps.length} remap(s)`)
  return clonedData
}

/**
 * 複数のOmikujiDataをマージ
 * Record型のプロパティはキーをマージ、その他は上書き
 */
function mergeOmikujiData(...dataArray: OmikujiDataType[]): OmikujiDataType {
  const result: OmikujiDataType = {} as OmikujiDataType

  for (const data of dataArray) {
    // Record型のプロパティはキーをマージ
    result.comments = { ...result.comments, ...data.comments }
    result.timers = { ...result.timers, ...data.timers }
    result.actionSets = { ...result.actionSets, ...data.actionSets }
    result.placeholders = { ...result.placeholders, ...data.placeholders }
    result.characters = { ...result.characters, ...data.characters }

    // その他は上書き
    result.wordPartySettings = result.wordPartySettings = data.wordPartySettings
    if (data.meta) result.meta = data.meta
    if (data.scriptSettings) result.scriptSettings = data.scriptSettings
    if (data.displaySettings) result.displaySettings = data.displaySettings
    if (data.jsonMerge) result.jsonMerge = data.jsonMerge
  }

  return result
}
