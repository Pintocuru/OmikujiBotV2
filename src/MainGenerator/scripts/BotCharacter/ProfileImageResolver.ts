// src/MainGenerator/utils/commentProcessor/ProfileImageResolver.ts
import { CharacterEmotionType, CharacterType } from '@/types/OmikujiData/CharacterSchema'

/**
 * キャラクターのプロフィール画像を解決する
 * @param character - キャラクター情報
 * @param iconKey - 表示する感情アイコンのキー
 * @returns プロフィール画像のURL(string | string[] | null)
 */
export function resolveProfileImage(character: CharacterType, iconKey: CharacterEmotionType): string[] | string | null {
  // アイコン表示が無効の場合はnullを返す
  if (!character.displayOption.isIconDisplay) {
    return null
  }

  return getCharacterIcon(character, iconKey)
}

/**
 * キャラクターアイコンの取得
 * @param character - キャラクター情報
 * @param iconKey - 表示する感情アイコンのキー
 * @returns アイコンのURL(string | string[] | null)
 */
function getCharacterIcon(character: CharacterType, iconKey: CharacterEmotionType): string[] | string | null {
  const iconMap = character?.image
  if (!iconMap) return null

  // 指定されたアイコンを優先
  const iconValue = iconMap[iconKey]
  if (iconValue && iconValue !== '') return iconValue

  // デフォルトアイコンにフォールバック
  const defaultIcon = iconMap['default']
  return defaultIcon && defaultIcon !== '' ? defaultIcon : null
}

/**
 * キャラクターキーと感情キーから直接プロフィール画像を解決する
 * @param characterKey - キャラクターのキー
 * @param iconKey - 表示する感情アイコンのキー
 * @param characters - キャラクター辞書
 * @returns プロフィール画像のURL(string | string[] | null)
 */
export function resolveProfileImageByKey(
  characterKey: string,
  iconKey: CharacterEmotionType,
  characters: Record<string, CharacterType>
): string[] | string | null {
  const character = characters[characterKey]
  if (!character) return null

  return resolveProfileImage(character, iconKey)
}
