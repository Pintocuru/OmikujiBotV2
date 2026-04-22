// src/common/sounds/PlaySound.ts
import { RpgVoiceKeyType, rpgVoiceMap } from '@/types'
import { resolveSound } from './soundUtils'

// 1文字あたりの再生時間（ミリ秒）
const RPG_VOICE_MS_PER_CHARACTER = 50

function resolveAsset(path: string) {
  const base = window.OmikujiBot?.assetBase ?? './'
  return base + path
}

/**
 * sound + soundPath を解決して再生
 */
export const playSoundResolved = (sound: string, soundPath = '') => {
  const path = resolveSound(sound, soundPath)
  if (!path) return
  const audio = new Audio(resolveAsset(path))
  audio.currentTime = 0
  audio.play().catch((e) => console.warn(`Sound failed to play:`, e))
}

/**
 * 指定秒数後に再生
 */
export const playSoundDelay = (sound: string, soundPath = '', delaySeconds = 0) => {
  if (!sound && !soundPath) return
  setTimeout(() => playSoundResolved(sound, soundPath), delaySeconds * 1000)
}

/**
 * RPG風音声ループ
 */
export const playRpgVoiceLoop = (text: string, key: RpgVoiceKeyType, delaySeconds = 0) => {
  if (!text || !key) return

  setTimeout(() => {
    const durationMs = text.length * RPG_VOICE_MS_PER_CHARACTER
    const path = rpgVoiceMap[key]?.path

    if (!path) {
      console.warn(`RPG voice "${key}" not found`)
      return
    }

    const audio = new Audio(resolveAsset(path))
    audio.currentTime = 0

    audio.play().catch((e) => {
      console.warn(`RPG voice failed:`, e)
    })

    setTimeout(() => {
      audio.pause()
      audio.currentTime = 0
    }, durationMs)
  }, delaySeconds * 1000)
}
