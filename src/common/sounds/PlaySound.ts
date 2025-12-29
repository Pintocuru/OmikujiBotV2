// src/Toolkit/sounds/PlaySound.ts
import { rpgVoiceMap, soundMap } from './soundMap'

// 1文字あたりの再生時間（ミリ秒）
const RPG_VOICE_MS_PER_CHARACTER = 50

/**
 * 即時再生
 */
export const playSound = (soundName: string) => {
  const src = soundMap[soundName] ?? rpgVoiceMap[soundName]
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

/**
 * 指定秒数後に再生
 */
export const playSoundDelay = (soundName: string, delaySeconds = 0) => {
  if (!soundName) return
  setTimeout(() => {
    playSound(soundName)
  }, delaySeconds * 1000)
}

/**
 * RPG風音声ループを再生（テキスト長に応じて自動停止）
 */
export const playRpgVoiceLoop = (text: string, soundName: string, delaySeconds: number = 0) => {
  if (!text || !soundName) return

  setTimeout(() => {
    const durationMs = text.length * RPG_VOICE_MS_PER_CHARACTER

    const src = soundMap[soundName] ?? rpgVoiceMap[soundName]
    if (!src) {
      console.warn(`RPG voice "${soundName}" not found`)
      return
    }

    const audio = new Audio(src)
    audio.currentTime = 0
    audio.play().catch((e) => {
      console.warn(`RPG voice sound failed to play:`, e)
    })

    setTimeout(() => {
      audio.pause()
      audio.currentTime = 0
    }, durationMs)
  }, delaySeconds * 1000)
}
