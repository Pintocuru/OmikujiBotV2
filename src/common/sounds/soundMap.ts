// src/common/sounds/soundMap.ts
import { RpgVoiceKeyType, SoundKeyType } from '@/types/OmikujiData/SoundKey'

export const soundMap: Record<SoundKeyType, string> = {
  cute: 'assets/sounds/FreeSound/cute.mp3',
  nya: 'assets/sounds/FreeSound/nya.mp3',
  bubble: 'assets/sounds/FreeSound/bubble.mp3',
  twinkle: 'assets/sounds/FreeSound/twinkle.mp3',
  bounce: 'assets/sounds/FreeSound/bounce.mp3',
  jingle: 'assets/sounds/FreeSound/jingle.mp3',
  collect: 'assets/sounds/FreeSound/collect.mp3',
  cash: 'assets/sounds/FreeSound/cash.mp3',
  notification: 'assets/sounds/FreeSound/notification.mp3',
  news: 'assets/sounds/FreeSound/news.mp3',
  decision: 'assets/sounds/FreeSound/decision.mp3',
  reveal: 'assets/sounds/FreeSound/reveal.mp3',
  reveal_full: 'assets/sounds/FreeSound/reveal_full.mp3',
  transition: 'assets/sounds/FreeSound/transition.mp3',
  applause: 'assets/sounds/FreeSound/applause.mp3',
  congrats: 'assets/sounds/FreeSound/congrats.mp3',
  fanfare: 'assets/sounds/FreeSound/fanfare.mp3',
  carnival: 'assets/sounds/FreeSound/carnival.mp3',
  baseball: 'assets/sounds/FreeSound/baseball.mp3',
  drum_hit: 'assets/sounds/FreeSound/drum_hit.mp3',
  warn: 'assets/sounds/FreeSound/warn.mp3',
  cancel: 'assets/sounds/FreeSound/cancel.mp3',
  negative: 'assets/sounds/FreeSound/negative.mp3',
  fail: 'assets/sounds/FreeSound/fail.mp3',
  explosion: 'assets/sounds/FreeSound/explosion.mp3',
}

export const rpgVoiceMap: Record<RpgVoiceKeyType, string> = {
  rpg_voice_a5: 'assets/sounds/RpgVoice/rpg_voice_a5.mp3',
  rpg_voice_b4: 'assets/sounds/RpgVoice/rpg_voice_b4.mp3',
  rpg_voice_c5: 'assets/sounds/RpgVoice/rpg_voice_c5.mp3',
  rpg_voice_f2: 'assets/sounds/RpgVoice/rpg_voice_f2.mp3',
  rpg_voice_g3: 'assets/sounds/RpgVoice/rpg_voice_g3.mp3',
}

export const soundList = Object.keys(soundMap)
export const rpgVoiceList = Object.keys(rpgVoiceMap)
