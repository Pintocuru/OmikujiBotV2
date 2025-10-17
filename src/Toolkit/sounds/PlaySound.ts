// src\Toolkit\sounds\PlaySound.ts
import { soundMap } from './soundMap'

export const playSound = (soundName: keyof typeof soundMap) => {
  const sound = soundMap[soundName]
  sound.currentTime = 0
  sound.play()
}
