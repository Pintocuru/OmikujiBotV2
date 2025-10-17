import s0 from '@assets/sound/SoundeffectLab/「おめでとうございます」.mp3'

// soundMap.ts
export const soundMap = {
  "「おめでとうございます」": new Audio(s0),
} as const

export const soundList = Object.keys(soundMap)

