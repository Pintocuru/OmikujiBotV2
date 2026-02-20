// src/types/MetaMaps/SoundKeyMaps.ts
import type { SoundKeyType, RpgVoiceKeyType } from '../OmikujiData/SoundKey'

/**
 * サウンドキーの表示名マップ
 */
export const soundMetaMap: Record<SoundKeyType, string> = {
  cute: 'ぽよん',
  nya: 'にゃーん',
  bubble: 'ポコン',
  twinkle: 'キラキラ',
  bounce: 'ボヨン',
  jingle: 'ジングル',
  collect: '取得音',
  cash: 'お金チャリン',
  notification: '通知音',
  news: 'ニュース風',
  decision: '決定音',
  reveal: '＼ジャン／',
  reveal_full: '＼ジャジャーン／',
  transition: 'トランジション',
  applause: '拍手',
  congrats: 'お祝い',
  fanfare: 'ファンファーレ',
  carnival: 'カーニバル',
  baseball: 'レベルアップ',
  drum_hit: 'ドラム',
  warn: 'ブレーキ',
  cancel: 'キャンセル',
  negative: 'ざんねん',
  fail: '失敗',
  explosion: '爆発',
}

/**
 * RPG風サウンドキーの表示名マップ
 */
export const rpgVoiceMetaMap: Record<RpgVoiceKeyType, string> = {
  rpg_voice_a5: 'A5（落ち着き）',
  rpg_voice_b4: 'B4（高め）',
  rpg_voice_c5: 'C5（標準）',
  rpg_voice_f2: 'F2（低音・ゆらぎ）',
  rpg_voice_g3: 'G3（中低音・ゆらぎ）',
}
