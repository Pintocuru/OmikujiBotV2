// src/types/OmikujiData/SoundKey.ts
import { rpgVoiceMetaMap, soundMetaMap } from '../MetaMaps'

/**
 * サウンドキー
 */
export type SoundKeyType = keyof typeof soundMetaMap
export const soundKeys = Object.keys(soundMetaMap) as SoundKeyType[]

/**
 * RPG風サウンド
 */
export const rpgVoiceKeys = Object.keys(rpgVoiceMetaMap) as RpgVoiceKeyType[]
export type RpgVoiceKeyType = keyof typeof rpgVoiceMetaMap
