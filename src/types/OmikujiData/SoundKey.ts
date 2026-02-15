// src\types\OmikujiData\SoundKey.ts

// サウンドの種類
export const soundMetaMap = {
  cute: 'かわいい効果音',
  nya: 'にゃーん',
  bubble: 'ポコポコ',
  twinkle: 'キラキラ',
  bounce: 'ボヨン',
  jingle: 'ジングル',
  collect: '取得音',
  cash: 'お金チャリン',
  notification: '通知音',
  news: 'ニュース風',
  decision: '決定音',
  reveal: 'リビール',
  reveal_full: 'フルリビール',
  transition: 'トランジション',
  applause: '拍手',
  congrats: 'お祝い',
  fanfare: 'ファンファーレ',
  carnival: 'カーニバル',
  baseball: '野球',
  drum_hit: 'ドラム',
  warn: '警告',
  cancel: 'キャンセル',
  negative: 'ネガティブ',
  fail: '失敗',
  explosion: '爆発',
} as const

export type SoundKeyType = keyof typeof soundMetaMap
export const soundKeys = Object.keys(soundMetaMap) as SoundKeyType[]

/**
 * RPG風サウンド
 */
export const rpgVoiceMetaMap = {
  rpg_voice_a5: 'A5（高め）',
  rpg_voice_b4: 'B4（落ち着き）',
  rpg_voice_c5: 'C5（標準）',
  rpg_voice_f2: 'F2（低音）',
  rpg_voice_g3: 'G3（中低音）',
} as const

export const rpgVoiceKeys = Object.keys(rpgVoiceMetaMap) as RpgVoiceKeyType[]
export type RpgVoiceKeyType = keyof typeof rpgVoiceMetaMap
