// src/types/MetaMaps/CharacterMaps.ts

/**
 * 感情ラベルマップ
 */
export const characterEmotionMap = {
  default: 'デフォルト(default)',
  happy: '嬉しい(happy)',
  surprised: '驚き(surprised)',
  sad: '悲しみ(sad)',
  angry: '怒り(angry)',
  thinking: '考え中(thinking)',
} as const

/**
 *
 */
export const systemBotMap = {
  omiken: 'おみくじBOT(その1)',
  omiken2: 'おみくじBOT(その2)',
} as const

/**
 * 表示モードのラベルマップ
 */
export const displayModeMap = {
  comment: 'わんコメでの表示+読み上げ',
  voice: '読み上げのみ',
  rpgVoice: 'RPG風音声',
  none: 'なし',
} as const
