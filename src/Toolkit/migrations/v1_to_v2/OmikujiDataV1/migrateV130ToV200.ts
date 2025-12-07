// src\Toolkit\migrations\v1_to_v2\OmikujiDataV1\migrateV130ToV200.ts
import {
  DeveloperSettingsSchema,
  DisplaySettingsSchema,
  DisplaySettingsType,
  SettingsBubbleSchema,
  SettingsComponentsSchema,
  SettingsCounterSchema,
  SettingsEditorSchema,
  SettingsRankingSchema,
  SettingsThumbnailSchema,
  SettingsToastSchema,
} from '@/types/OmikujiData/DisplaySettingsSchema'
import { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'

// 新スキーマへのマイグレーション
function migrateDisplaySettings(old: any): DisplaySettingsType {
  const base = old.base ?? {}

  const bubble = SettingsBubbleSchema.parse({
    showCharacters: [], // 新設 → 空配列
    showCharacterFrame: base.showCharacterFrame ?? true,
    characterSize: 320, // 新設 → デフォルト
    fontFamily: base.fontFamily ?? 'default',
    bubbleMotionEnter: base.bubbleMotionEnter ?? 'slideUp',
    bubbleMotionLeave: base.bubbleMotionLeave ?? 'slideUp',
    bubbleTextAnimate: base.bubbleTextAnimate ?? false,
    bubbleTextSpeed: base.bubbleTextSpeed ?? 50,
    bubbleTextSound: undefined,
  })

  const toast = SettingsToastSchema.parse({
    showToastsOnRight: base.showToastsOnRight ?? true,
    showToastsCharacter: base.showToastsCharacter ?? false,
  })

  const thumbnail = SettingsThumbnailSchema.parse({
    showThumbnail: base.showCharacterThumbnail ? ['default'] : [],
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
    id: null,
    target: 'runCount',
    label: 'Counter',
    value: 0,
    color: 'dark',
    showLabel: true,
  })

  const components = SettingsComponentsSchema.parse({
    bubble,
    toast,
    thumbnail,
    ranking,
    counter,
  })

  const editor = SettingsEditorSchema.parse({
    licenseKeyHash: old.licenseKeyHash ?? '',
    daisyUiTheme: base.daisyUiTheme ?? 'dark',
  })

  const developer = DeveloperSettingsSchema.parse(old.developer ?? {})

  return DisplaySettingsSchema.parse({
    components,
    editor,
    developer,
  })
}
