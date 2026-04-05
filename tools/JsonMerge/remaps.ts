// tools/JsonMerge/remaps.ts
import type { OmikujiDataType } from '@/types/OmikujiData/'
import type { JsonMergeRemapType } from '@/types/OmikujiData/'
import type { ActionSetType, PostFlowType, GameScriptsType } from '@/types/OmikujiData/'
import { eventCategoryLabel } from '@/types/OmikujiData'

/**
 * PostActionの配列に対してリマップルールを適用
 */
function remapPostActions(postActions: PostFlowType[], remaps: JsonMergeRemapType[]): PostFlowType[] {
  return postActions.map((action) => {
    // message以外のactionTypeは早期return
    if (action.actionType !== 'message') return action

    let remappedAction: PostFlowType = { ...action }
    let hasChanged = false

    for (const remap of remaps) {
      // characterKeyの置き換え
      if (remap.fromCharacterKey && remap.toCharacterKey && remappedAction.characterKey === remap.fromCharacterKey) {
        remappedAction = {
          ...remappedAction,
          characterKey: remap.toCharacterKey,
        }
        hasChanged = true
      }

      // iconKeyの置き換え
      if (remap.fromIconKey && remap.toIconKey && remappedAction.iconKey === remap.fromIconKey) {
        remappedAction = {
          ...remappedAction,
          iconKey: remap.toIconKey,
        }
        hasChanged = true
      }
    }

    // 変更がなければ元のオブジェクトを返す(メモリ節約)
    return hasChanged ? remappedAction : action
  })
}

/**
 * GameScriptsに対してリマップルールを適用
 */
function remapGameScripts(gameScripts: GameScriptsType, remaps: JsonMergeRemapType[]): GameScriptsType {
  // characterKeyが空の場合は早期return
  if (!gameScripts.characterKey) return gameScripts

  let remappedScripts: GameScriptsType = gameScripts
  let hasChanged = false

  for (const remap of remaps) {
    // characterKeyの置き換え
    if (remap.fromCharacterKey && remap.toCharacterKey && remappedScripts.characterKey === remap.fromCharacterKey) {
      remappedScripts = {
        ...remappedScripts,
        characterKey: remap.toCharacterKey,
      }
      hasChanged = true
      break // characterKeyは1つしかないので、マッチしたら終了
    }
  }

  return hasChanged ? remappedScripts : gameScripts
}

/**
 * OmikujiData全体に対してリマップを適用
 */
export function applyRemaps(data: OmikujiDataType, remaps: JsonMergeRemapType[]): OmikujiDataType {
  if (!remaps?.length) return data

  const clonedData: OmikujiDataType = JSON.parse(JSON.stringify(data))

  // Rulesカテゴリを網羅的に処理
  for (const category of eventCategoryLabel) {
    remapOmikujiGroup(clonedData[category], remaps)
  }

  // actionSets処理
  if (clonedData.actionSets) {
    for (const key in clonedData.actionSets) {
      const actionSet = clonedData.actionSets[key]

      if (actionSet.postActions?.length) {
        actionSet.postActions = remapPostActions(actionSet.postActions, remaps)
      }

      if (actionSet.gameScripts) {
        actionSet.gameScripts = remapGameScripts(actionSet.gameScripts, remaps)
      }
    }
  }

  return clonedData
}

function remapOmikujiGroup(
  group: Record<string, { omikuji: ActionSetType[] }> | undefined,
  remaps: JsonMergeRemapType[]
) {
  // groupが存在しない場合は早期return
  if (!group) return

  for (const key in group) {
    const entry = group[key]

    entry.omikuji = entry.omikuji.map((item) => {
      const remappedItem: ActionSetType = { ...item }

      // postActionsのリマップ
      if (item.postActions && item.postActions.length > 0) {
        remappedItem.postActions = remapPostActions(item.postActions, remaps)
      }

      // gameScriptsのリマップ
      if (item.gameScripts && item.gameScripts.scriptId !== null) {
        remappedItem.gameScripts = remapGameScripts(item.gameScripts, remaps)
      }

      return remappedItem
    })
  }
}
