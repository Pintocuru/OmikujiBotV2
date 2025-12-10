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

/**
 * v1からv1.3へのマイグレーション
 * omikuji配列内のオブジェクトのkeyが空文字の場合、idをコピーする
 */
export function migrateV130ToV200(data: any): OmikujiDataType {
  const migratedData = { ...data }

  // comments のマイグレーション
  if (migratedData.displaySettings) {
    migratedData.displaySettings = migrateDisplaySettings(migratedData.displaySettings)
  }

  console.log('Migration to v1.3 completed: omikuji keys補完完了')
  return migratedData
}

// 新スキーマへのマイグレーション
function migrateDisplaySettings(old: any): DisplaySettingsType {
  const base = old.base ?? {}

  const global = SettingsGlobalSchema.parse({
    fontFamily: base.fontFamily ?? 'default',
  })

  const bubble = SettingsBubbleSchema.parse({
    showCharacters: [], // 新設 → 空配列
    showCharacterFrame: base.showCharacterFrame ?? true,
    characterSize: 320, // 新設 → デフォルト
    bubbleMotionEnter: base.bubbleMotionEnter ?? 'slideUp',
    bubbleMotionLeave: base.bubbleMotionLeave ?? 'slideUp',
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
