// tools/JsonMerge/remaps.ts
import type { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import type { JsonMergeRemapType } from '@/types/OmikujiData/JsonMergeType'
import type { OmikujiItemType, PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { CharacterEmotionType } from '@/types'

/**
 * PostActionの配列に対してリマップルールを適用
 * characterKeyおよびiconKeyを置き換える
 *
 * @param postActions - リマップ対象のPostAction配列
 * @param remaps - 適用するリマップルール
 * @returns リマップ後のPostAction配列
 */
function remapPostActions(postActions: PostActionType[], remaps: JsonMergeRemapType[]): PostActionType[] {
  return postActions.map((action) => {
    let remappedAction: PostActionType = { ...action }

    for (const remap of remaps) {
      // characterKeyの置き換え
      if (remap.fromCharacterKey && remap.toCharacterKey) {
        if (remappedAction.actionType !== 'message') continue
        if (remappedAction.characterKey === remap.fromCharacterKey) {
          remappedAction = {
            ...remappedAction,
            characterKey: remap.toCharacterKey,
          }
        }
      }

      // iconKeyの置き換え
      if (remap.fromIconKey && remap.toIconKey) {
        if (remappedAction.actionType !== 'message') continue
        if (remappedAction.iconKey === remap.fromIconKey) {
          remappedAction = {
            ...remappedAction,
            iconKey: remap.toIconKey as CharacterEmotionType,
          }
        }
      }
    }

    return remappedAction
  })
}

/**
 * OmikujiData全体に対してリマップを適用
 * comments, timers, actionSetsの中のPostActionをすべてリマップする
 *
 * @param data - リマップ対象のOmikujiData
 * @param remaps - 適用するリマップルール
 * @returns リマップ後のOmikujiData
 */
export function applyRemaps(data: OmikujiDataType, remaps: JsonMergeRemapType[]): OmikujiDataType {
  if (!remaps || remaps.length === 0) return data

  const clonedData: OmikujiDataType = JSON.parse(JSON.stringify(data))

  // commentsのPostActionをリマップ
  remapOmikujiGroup(clonedData.comments, remaps)
  remapOmikujiGroup(clonedData.timers, remaps)

  // actionSetsのPostActionをリマップ
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

function remapOmikujiGroup(
  group: Record<string, { omikuji: OmikujiItemType[] }> | undefined,
  remaps: JsonMergeRemapType[]
) {
  if (!group) return

  for (const key in group) {
    const entry = group[key]

    entry.omikuji = entry.omikuji.map((item) => ({
      ...item,
      postActions: item.postActions ? remapPostActions(item.postActions, remaps) : [],
    }))
  }
}
