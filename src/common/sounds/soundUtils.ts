// src/common/sounds/soundUtils.ts
import { RpgVoiceKeyType, rpgVoiceMap, SoundKeyType, soundMap } from '@/types'

export type AnySoundKey = SoundKeyType | RpgVoiceKeyType

/** プリセットサウンドのベースパス（末尾スラッシュなし） */
export const SOUND_BASE_PATH = 'assets/sounds' as const

/**
 * キーからパス（ベースパス付き）を返す
 * 例: 'cute' → 'assets/sounds/FreeSound/cute.mp3'
 */
function getSoundPath(key: AnySoundKey): string | undefined {
  const relativePath =
    (soundMap as Record<string, { path: string }>)[key]?.path ??
    (rpgVoiceMap as Record<string, { path: string }>)[key]?.path

  return relativePath ? `${SOUND_BASE_PATH}/${relativePath}` : undefined
}

/**
 * sound（プリセットキー）と soundPath（カスタムパス）を解決し、
 * 実際に再生すべきパスを返す。soundPath が優先される。
 */
export function resolveSound(sound: string, soundPath: string): string | null {
  if (soundPath) return `${SOUND_BASE_PATH}/${soundPath}`
  if (sound) return getSoundPath(sound as AnySoundKey) ?? null
  return null
}
