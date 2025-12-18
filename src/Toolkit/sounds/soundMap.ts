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

export const soundMap: Record<string, string> = {
  applause: f0,
  baseball: f1,
  bounce: f2,
  bubble: f3,
  cancel: f4,
  carnival: f5,
  cash: f6,
  collect: f7,
  congrats: f8,
  cute: f9,
  decision: f10,
  drum_hit: f11,
  explosion: f12,
  fail: f13,
  fanfare: f14,
  jingle: f15,
  negative: f16,
  news: f17,
  notification: f18,
  nya: f19,
  reveal: f20,
  reveal_full: f21,
  transition: f22,
  twinkle: f23,
  warn: f24,
}

export const rpgVoiceMap: Record<string, string> = {
  rpg_voice_a5: r0,
}

export const soundList = Object.keys(soundMap)
export const rpgVoiceList = Object.keys(rpgVoiceMap)
