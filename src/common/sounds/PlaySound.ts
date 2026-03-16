// src/common/sounds/PlaySound.ts
import { RpgVoiceKeyType, SoundKeyType } from '@/types'
import { rpgVoiceMap, soundMap } from './soundMap'

// 1文字あたりの再生時間（ミリ秒）
const RPG_VOICE_MS_PER_CHARACTER = 50

function resolveAsset(path: string) {
  console.log(window.OmikujiBot?.assetBase)
  const base = window.OmikujiBot?.assetBase ?? './'
  return base + path
}

function getSoundSrc(soundName: SoundKeyType | RpgVoiceKeyType) {
  return (soundMap as Record<string, string>)[soundName] ?? (rpgVoiceMap as Record<string, string>)[soundName]
}

/**
 * 即時再生
 */
export const playSound = (soundName: SoundKeyType | RpgVoiceKeyType) => {
  const path = getSoundSrc(soundName)

  if (!path) {
    console.warn(`Sound "${soundName}" not found`)
    return
  }

  const audio = new Audio(resolveAsset(path))
  audio.currentTime = 0
  audio.play().catch((e) => {
    console.warn(`Sound "${soundName}" failed to play:`, e)
  })
}

/**
 * 指定秒数後に再生
 */
export const playSoundDelay = (soundName: SoundKeyType | RpgVoiceKeyType, delaySeconds = 0) => {
  if (!soundName) return

  setTimeout(() => {
    playSound(soundName)
  }, delaySeconds * 1000)
}

/**
 * RPG風音声ループを再生（テキスト長に応じて自動停止）
 */
export const playRpgVoiceLoop = (text: string, soundName: RpgVoiceKeyType, delaySeconds = 0) => {
  if (!text || !soundName) return

  setTimeout(() => {
    const durationMs = text.length * RPG_VOICE_MS_PER_CHARACTER
    const path = rpgVoiceMap[soundName]

    if (!path) {
      console.warn(`RPG voice "${soundName}" not found`)
      return
    }

    const audio = new Audio(resolveAsset(path))
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
