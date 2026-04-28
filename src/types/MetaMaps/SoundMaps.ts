// src/types/MetaMaps/SoundMaps.ts

/**
 * サウンドキーの表示名マップ
 */
export const soundMap = {
  cute: { label: 'ぽよん', path: 'FreeSound/cute.mp3' },
  nya: { label: 'にゃーん', path: 'FreeSound/nya.mp3' },
  bubble: { label: 'ポコン', path: 'FreeSound/bubble.mp3' },
  twinkle: { label: 'キラキラ', path: 'FreeSound/twinkle.mp3' },
  bounce: { label: 'ボヨン', path: 'FreeSound/bounce.mp3' },
  jingle: { label: 'ジングル', path: 'FreeSound/jingle.mp3' },
  collect: { label: '取得音', path: 'FreeSound/collect.mp3' },
  cash: { label: 'お金チャリン', path: 'FreeSound/cash.mp3' },
  notification: { label: '通知音', path: 'FreeSound/notification.mp3' },
  news: { label: 'ニュース風', path: 'FreeSound/news.mp3' },
  decision: { label: '決定音', path: 'FreeSound/decision.mp3' },
  reveal: { label: '＼ジャン／', path: 'FreeSound/reveal.mp3' },
  reveal_full: { label: '＼ジャジャーン／', path: 'FreeSound/reveal_full.mp3' },
  transition: { label: 'トランジション', path: 'FreeSound/transition.mp3' },
  applause: { label: '拍手', path: 'FreeSound/applause.mp3' },
  congrats: { label: 'お祝い', path: 'FreeSound/congrats.mp3' },
  fanfare: { label: 'ファンファーレ', path: 'FreeSound/fanfare.mp3' },
  carnival: { label: 'カーニバル', path: 'FreeSound/carnival.mp3' },
  baseball: { label: 'レベルアップ', path: 'FreeSound/baseball.mp3' },
  drum_hit: { label: 'ドラム', path: 'FreeSound/drum_hit.mp3' },
  warn: { label: 'ブレーキ', path: 'FreeSound/warn.mp3' },
  cancel: { label: 'キャンセル', path: 'FreeSound/cancel.mp3' },
  negative: { label: 'ざんねん', path: 'FreeSound/negative.mp3' },
  fail: { label: '失敗', path: 'FreeSound/fail.mp3' },
  explosion: { label: '爆発', path: 'FreeSound/explosion.mp3' },
} as const

/**
 * RPG風サウンドキーの表示名マップ
 */
export const rpgVoiceMap = {
  rpg_voice_a5: { label: 'A5（落ち着き）', path: 'RpgVoice/rpg_voice_a5.mp3' },
  rpg_voice_b4: { label: 'B4（高め）', path: 'RpgVoice/rpg_voice_b4.mp3' },
  rpg_voice_c5: { label: 'C5（標準）', path: 'RpgVoice/rpg_voice_c5.mp3' },
  rpg_voice_f2: { label: 'F2（低音・ゆらぎ）', path: 'RpgVoice/rpg_voice_f2.mp3' },
  rpg_voice_g3: { label: 'G3（中低音・ゆらぎ）', path: 'RpgVoice/rpg_voice_g3.mp3' },
} as const
