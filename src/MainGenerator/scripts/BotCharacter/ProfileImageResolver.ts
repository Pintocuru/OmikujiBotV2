// src/MainGenerator/utils/commentProcessor/ProfileImageResolver.ts
import { CharacterEmotionType, CharacterType } from '@/types/OmikujiData/CharacterSchema'

/**
 * キャラクターのプロフィール画像を解決する
 * @param character - キャラクター情報
 * @param iconKey - 表示する感情アイコンのキー
 * @returns プロフィール画像のURL
 */
export function resolveProfileImage(character: CharacterType, iconKey: CharacterEmotionType): string[] {
  return getCharacterIcon(character, iconKey)
}

/**
 * キャラクターアイコンの取得
 * @param character - キャラクター情報
 * @param iconKey - 表示する感情アイコンのキー
 * @returns アイコンのURL
 */
function getCharacterIcon(character: CharacterType, iconKey: CharacterEmotionType): string[] {
  const iconMap = character?.image
  if (!iconMap) return []

  // 指定されたアイコンを優先
  const iconValue = iconMap[iconKey]
  if (iconValue.length !== 0) return iconValue

  // デフォルトアイコンにフォールバック
  const defaultIcon = iconMap['default']
  return iconValue.length !== 0 ? defaultIcon : []
}

/**
 * キャラクターキーと感情キーから直接プロフィール画像を解決する
 * @param characterKey - キャラクターのキー
 * @param iconKey - 表示する感情アイコンのキー
 * @param characters - キャラクター辞書
 * @returns プロフィール画像のURL(string[])
 */
export function resolveProfileImageByKey(
  characterKey: string,
  iconKey: CharacterEmotionType,
  characters: Record<string, CharacterType>
): string[] {
  const character = characters[characterKey]
  if (!character) return []

  return resolveProfileImage(character, iconKey)
}
