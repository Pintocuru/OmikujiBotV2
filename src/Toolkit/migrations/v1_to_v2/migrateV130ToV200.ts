// src\Toolkit\migrations\v1_to_v2\OmikujiDataV1\migrateV130ToV200.ts
import {
  DeveloperSettingsSchema,
  DisplaySettingsSchema,
  DisplaySettingsType,
  SettingsBubbleSchema,
  SettingsComponentsSchema,
  SettingsCounterSchema,
  SettingsEditorSchema,
  SettingsGlobalSchema,
  SettingsRankingSchema,
  SettingsToastSchema,
} from '@/types/OmikujiData/DisplaySettingsSchema'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'
import { PostActionType } from '@/types/OmikujiData/OmikujiSchema'
import { OmikujiDataTypeV1 } from './OmikujiDataV1/OmikujiDataSchema'

/**
 * v1からv1.3へのマイグレーション
 * omikuji配列内のオブジェクトのkeyが空文字の場合、idをコピーする
 */
export function migrateV130ToV200(data: OmikujiDataTypeV1): OmikujiDataType {
  const migratedData: any = { ...data }

  // comments のマイグレーション
  if (migratedData.displaySettings) {
    migratedData.displaySettings = migrateDisplaySettings(migratedData.displaySettings)
  }

  // actionSets の手動マイグレーション
  if (migratedData.actionSets) {
    for (const key in migratedData.actionSets) {
      const actionSet = migratedData.actionSets[key]
      actionSet.postActions = actionSet.postActions.flatMap(migratePostAction) // ←ここで適用
      // ソート処理も必要
      actionSet.postActions.sort((a: any, b: any) => a.delaySeconds - b.delaySeconds)
    }
  }

  console.log('Migration to v2.0 completed: omikuji keys補完完了')
  return migratedData
}

// 新スキーマへのマイグレーション
function migrateDisplaySettings(old: OmikujiDataTypeV1['displaySettings']): DisplaySettingsType {
  const base = old.base ?? {}

  const global = SettingsGlobalSchema.parse({
    fontFamily: base.fontFamily ?? 'default',
  })

  const bubble = SettingsBubbleSchema.parse({
    bubbleMotionEnter: base.bubbleMotionEnter ?? 'slideUp',
    bubbleTextAnimate: base.bubbleTextAnimate ?? false,
    bubbleTextSpeed: base.bubbleTextSpeed ?? 50,
    bubbleTextSound: undefined,
  })

  const toast = SettingsToastSchema.parse({
    showToastsOnRight: base.showToastsOnRight ?? true,
    showToastsCharacter: base.showToastsCharacter ?? false,
    showThumbnail: [],
  })

  const ranking = SettingsRankingSchema.parse({
    scriptId: null,
    title: 'Ranking',
    limit: 10,
    showScore: true,
    showRankNumber: true,
    color: 'dark',
  })

  const counter = SettingsCounterSchema.parse({
    ruleKey: null,
    target: 'runCount',
    label: 'Counter',
    firstValue: 0,
    isDirectionUp: true,
    color: 'dark',
    showLabel: true,
  })

  const components = SettingsComponentsSchema.parse({
    bubble,
    toast,
    ranking,
    counter,
  })

  const editor = SettingsEditorSchema.parse({
    licenseKeyHash: old.licenseKeyHash ?? '',
    daisyUiTheme: base.daisyUiTheme ?? 'dark',
  })

  const developer = DeveloperSettingsSchema.parse(old.developer ?? {})

  return DisplaySettingsSchema.parse({
    global,
    components,
    editor,
    developer,
  })
}

/**
 * 古い PostAction オブジェクトを新しいスキーマ形式にマイグレーションする
 * @param oldAction 古い PostAction オブジェクト
 * @returns 新しい PostAction オブジェクトの配列
 */
const migratePostAction = (oldAction: any): PostActionType[] => {
  const newActions: PostActionType[] = []

  // 基本的な共通フィールド
  const baseFields = {
    delaySeconds: oldAction.delaySeconds ?? 0,
  }

  // 1. actionSet の移行
  if (oldAction.actionSetKey && oldAction.actionSetKey.trim() !== '') {
    newActions.push({
      ...baseFields,
      actionType: 'actionSet',
      actionSetKey: oldAction.actionSetKey,
    })
    // actionSet の場合は他のアクションを生成しない（古い transform に準拠）
    return newActions
  }

  // 2. message / toast の移行 (新しい 'message' actionTypeに集約)
  // messageContent と messageToast が両方存在する場合も、新しい PostActionMessageSchema で受け入れ可能
  if (
    (oldAction.messageContent && oldAction.messageContent.trim() !== '') ||
    (oldAction.messageToast && oldAction.messageToast.trim() !== '')
  ) {
    const characterFields = {
      characterKey: oldAction.characterKey ?? '',
      iconKey: oldAction.iconKey ?? 'default',
      enterMotion: oldAction.enterMotion,
      sound: oldAction.sound,
    }

    newActions.push({
      ...baseFields,
      actionType: 'message',
      ...characterFields,
      message: {
        bubble: oldAction.messageContent, // messageContent -> message.bubble
        toast: oldAction.messageToast, // messageToast -> message.toast
      },
    })
  }

  // 3. wordParty の移行
  // messageContentやmessageToastとは独立してwordPartyアクションを生成する
  if (oldAction.wordParty && oldAction.wordParty.trim() !== '') {
    newActions.push({
      ...baseFields,
      actionType: 'wordParty',
      wordParty: oldAction.wordParty,
    })
  }

  // 4. sounds の移行 (古い actionType: 'sounds' に対応)
  // 古い 'sounds' actionTypeは、新しい PostActionSoundSchema に対応する
  if (
    oldAction.sound &&
    oldAction.sound.trim() !== '' &&
    !oldAction.messageContent && // messageアクションに soundが統合されている場合を除く
    !oldAction.messageToast
  ) {
    // sound 専用のアクションを生成
    newActions.push({
      ...baseFields,
      actionType: 'sound',
      sound: oldAction.sound,
    })
  }

  // 処理すべきアクションが生成されなかった場合（全て空だった場合など）、messageTypeを強制的に生成し、空のメッセージオブジェクトを保持する
  if (newActions.length === 0) {
    newActions.push({
      ...baseFields,
      actionType: 'message',
      characterKey: oldAction.characterKey ?? '',
      iconKey: oldAction.iconKey ?? 'default',
      sound: oldAction.sound,
      message: {
        bubble: oldAction.messageContent,
        toast: oldAction.messageToast,
      },
    })
  }

  return newActions
}
