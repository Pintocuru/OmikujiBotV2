// src\Toolkit\sounds\PlaySound.ts
import { soundMap } from './soundMap'

export const playSound = (soundName: string) => {
  const src = soundMap[soundName]
  if (!src) {
    console.warn(`Sound "${soundName}" not found in soundMap`)
    return
  }

  const audio = new Audio(src)
  audio.currentTime = 0
  audio.play().catch((e) => {
    console.warn(`Sound "${soundName}" failed to play:`, e)
  })
}
