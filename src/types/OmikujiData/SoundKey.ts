// src/types/OmikujiData/SoundKey.ts
import { rpgVoiceMap, soundMap } from '../MetaMaps'

/**
 * サウンドキー
 */
export const soundKeys = Object.keys(soundMap) as SoundKeyType[]
export type SoundKeyType = keyof typeof soundMap

/**
 * RPG風サウンド
 */
export const rpgVoiceKeys = Object.keys(rpgVoiceMap) as RpgVoiceKeyType[]
export type RpgVoiceKeyType = keyof typeof rpgVoiceMap
