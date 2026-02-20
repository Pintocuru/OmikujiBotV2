// src/common/sounds/soundMap.ts
import { RpgVoiceKeyType, SoundKeyType } from '@/types/OmikujiData/SoundKey'

import f0 from '@assets/sounds/FreeSound/applause.mp3'
import f1 from '@assets/sounds/FreeSound/baseball.mp3'
import f2 from '@assets/sounds/FreeSound/bounce.mp3'
import f3 from '@assets/sounds/FreeSound/bubble.mp3'
import f4 from '@assets/sounds/FreeSound/cancel.mp3'
import f5 from '@assets/sounds/FreeSound/carnival.mp3'
import f6 from '@assets/sounds/FreeSound/cash.mp3'
import f7 from '@assets/sounds/FreeSound/collect.mp3'
import f8 from '@assets/sounds/FreeSound/congrats.mp3'
import f9 from '@assets/sounds/FreeSound/cute.mp3'
import f10 from '@assets/sounds/FreeSound/decision.mp3'
import f11 from '@assets/sounds/FreeSound/drum_hit.mp3'
import f12 from '@assets/sounds/FreeSound/explosion.mp3'
import f13 from '@assets/sounds/FreeSound/fail.mp3'
import f14 from '@assets/sounds/FreeSound/fanfare.mp3'
import f15 from '@assets/sounds/FreeSound/jingle.mp3'
import f16 from '@assets/sounds/FreeSound/negative.mp3'
import f17 from '@assets/sounds/FreeSound/news.mp3'
import f18 from '@assets/sounds/FreeSound/notification.mp3'
import f19 from '@assets/sounds/FreeSound/nya.mp3'
import f20 from '@assets/sounds/FreeSound/reveal.mp3'
import f21 from '@assets/sounds/FreeSound/reveal_full.mp3'
import f22 from '@assets/sounds/FreeSound/transition.mp3'
import f23 from '@assets/sounds/FreeSound/twinkle.mp3'
import f24 from '@assets/sounds/FreeSound/warn.mp3'
import r0 from '@assets/sounds/RpgVoice/rpg_voice_a5.mp3'
import r1 from '@assets/sounds/RpgVoice/rpg_voice_b4.mp3'
import r2 from '@assets/sounds/RpgVoice/rpg_voice_c5.mp3'
import r3 from '@assets/sounds/RpgVoice/rpg_voice_f2.mp3'
import r4 from '@assets/sounds/RpgVoice/rpg_voice_g3.mp3'

export const soundMap: Record<SoundKeyType, string> = {
  cute: f9,
  nya: f19,
  bubble: f3,
  twinkle: f23,
  bounce: f2,
  jingle: f15,
  collect: f7,
  cash: f6,
  notification: f18,
  news: f17,
  decision: f10,
  reveal: f20,
  reveal_full: f21,
  transition: f22,
  applause: f0,
  congrats: f8,
  fanfare: f14,
  carnival: f5,
  baseball: f1,
  drum_hit: f11,
  warn: f24,
  cancel: f4,
  negative: f16,
  fail: f13,
  explosion: f12,
}

export const rpgVoiceMap: Record<RpgVoiceKeyType, string> = {
  rpg_voice_a5: r0,
  rpg_voice_b4: r1,
  rpg_voice_c5: r2,
  rpg_voice_f2: r3,
  rpg_voice_g3: r4,
}

export const soundList = Object.keys(soundMap)
export const rpgVoiceList = Object.keys(rpgVoiceMap)
