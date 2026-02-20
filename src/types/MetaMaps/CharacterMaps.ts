// src/types/MetaMaps/CharacterMaps.ts
import type { CharacterEmotionType, DisplayModeType } from '../OmikujiData/CharacterSchema'

/**
 * 感情ラベルマップ
 */
export const emotionLabels: Record<CharacterEmotionType, string> = {
  default: 'デフォルト(default)',
  happy: '嬉しい(happy)',
  excited: 'ワクワク(excited)',
  laughing: '笑い(laughing)',
  blushing: '照れ(blushing)',
  surprised: '驚き(surprised)',
  sad: '悲しみ(sad)',
  angry: '怒り(angry)',
  thinking: '考え中(thinking)',
  wink: 'おふざけ(wink)',
  singing: '誇らしげ(singing)',
  sleepy: '退屈(sleepy)',
}

/**
 * 表示モードのラベルマップ
 */
export const displayModeLabels: Record<DisplayModeType, string> = {
  comment: 'わんコメでの表示+読み上げ',
  voice: '読み上げのみ',
  rpgVoice: 'RPG風音声',
  none: 'なし',
}
