// src/MainGenerator/scripts/CharacterManager/CharacterManager.ts
import { CharacterType, OmikujiDataType, CharacterColorType, DisplayOptionType } from '@/types'
import { resolveSettingMode } from '@/common/FeatureAccess/SettingMode'
import { hasAccessPure } from '@/common/FeatureAccess/useAccessChecker'

/**
 * キャラクター情報の解決とライセンス判定を一括管理
 */
export class CharacterManager {
  readonly characterMap: Map<string, CharacterType>
  readonly characterArray: CharacterType[]
  readonly isCharacterMode: boolean
  readonly defaultColor: CharacterColorType
  readonly defaultVoice: DisplayOptionType

  constructor(omikujiData: OmikujiDataType) {
    this.isCharacterMode = checkIsCharacterMode(omikujiData)
    this.characterMap = this.createCharacterMap(omikujiData.characters)
    this.defaultColor = omikujiData.components.commonStyle.defaultColor
    this.defaultVoice = omikujiData.components.commonStyle.defaultVoice

    // Mapから配列を生成（全キャラクターを含む）
    this.characterArray = Array.from(this.characterMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  /**
   * キャラクターの妥当性を検証し、適切なキーと表情を返す
   * 画像の有無に関わらず、定義が存在すればそのキャラクターのキーを維持する
   */
  resolveCharacter(data: { characterKey: string | null; iconKey: string }) {
    const { characterKey, iconKey } = data

    // キャラクター定義が存在するか確認。存在しない場合は null にフォールバック
    const exists = characterKey ? this.characterMap.has(characterKey) : false
    const resolvedCharacterKey = exists ? characterKey! : null

    // 表情キーの妥当性を確認（画像がない表情なら、そのキャラの 'default' 画像を参照させる）
    const resolvedEmotion = this.resolveEmotion(resolvedCharacterKey, iconKey)

    return {
      ...data,
      characterKey: resolvedCharacterKey,
      iconKey: resolvedEmotion,
    }
  }

  /**
   * キャラクター情報を取得。見つからない場合は null を返す
   */
  getCharacter(characterKey: string | null): CharacterType | null {
    if (!characterKey) return null
    return this.characterMap.get(characterKey) || null
  }

  /**
   * キャラクターキーから色を返す
   */
  getCharacterColor(characterKey: string | null): CharacterColorType {
    if (!this.isCharacterMode || !characterKey || !this.isValidCharacter(characterKey)) {
      return this.defaultColor
    }

    const character = this.getCharacter(characterKey)
    return character?.color ?? this.defaultColor
  }
  /**
   * characterKey = nullのときの音声を返す
   */
  getCharacterDefaultVoice(): DisplayOptionType {
    return this.defaultVoice
  }

  /**
   * 指定されたキャラクターが（画像アセットの有無にかかわらず）定義されているか確認
   */
  isValidCharacter(characterKey: string | null): boolean {
    if (!characterKey) return false
    return this.characterMap.has(characterKey)
  }

  /**
   * 指定されたキャラクターが有効な画像アセット（default表情）を持っているか確認
   */
  hasImage(characterKey: string | null): boolean {
    if (!characterKey) return false
    const char = this.characterMap.get(characterKey)
    if (!char) return false

    return Object.values(char.image).some((item) => item?.src.some((p) => p && p.trim()))
  }

  /**
   * 指定された表情の画像アセットが存在するか確認。ない場合はキャラクター自体の 'default' 画像を返す
   */
  resolveEmotion(characterKey: string | null, iconKey?: string): string {
    if (!characterKey || !iconKey) return 'default'
    const character = this.characterMap.get(characterKey)
    if (!character) return 'default'

    const hasTarget = character.image?.[iconKey]?.src.some((p) => p && p.trim()) ?? false
    if (hasTarget) return iconKey

    const hasDefault = character.image?.['default']?.src.some((p) => p && p.trim()) ?? false
    if (hasDefault) return 'default'

    // defaultもない場合は最初の有効な感情キーにフォールバック
    const fallbackKey = Object.entries(character.image).find(([_, item]) => item?.src.some((p) => p && p.trim()))?.[0]

    return fallbackKey ?? 'default'
  }

  /**
   * キャラクターとアイコンから画像urlを返す
   */
  iconSrc(characterKey: string | null, iconKey = 'default'): string[] {
    if (!characterKey) return []
    const char = this.characterMap.get(characterKey)
    if (!char) return []

    const getSrc = (key: string) => char.image?.[key]?.src.filter((p) => p && p.trim()) ?? []

    const target = getSrc(iconKey)
    if (target.length > 0) return target

    const defaultSrc = getSrc('default')
    if (defaultSrc.length > 0) return defaultSrc

    // defaultもなければ最初の有効なsrcを返す
    for (const item of Object.values(char.image)) {
      const src = item?.src.filter((p) => p && p.trim()) ?? []
      if (src.length > 0) return src
    }

    return []
  }

  /**
   * characterMapの生成（ライセンス無効時は空のMapを返す）
   */
  private createCharacterMap(characters: Record<string, CharacterType>): Map<string, CharacterType> {
    if (!this.isCharacterMode) return new Map()
    return new Map<string, CharacterType>(Object.values(characters).map((char) => [char.key, char]))
  }

  /**
   * キャラクターモード（ライセンス）の有効判定
   */
  private checkIsCharacter(omikujiData: OmikujiDataType): boolean {
    const { featureUsage, characters, settings } = omikujiData
    const usageCharacters = featureUsage.usage.characters
    const hasCharacters = Object.keys(characters).length > 0
    const mode = resolveSettingMode(settings.licenseKeyHash)
    return hasAccessPure(usageCharacters, mode) && hasCharacters
  }
}

/**
 * キャラクターモード（ライセンス）の有効判定
 * CharacterManager 外でも使用可能
 */
export function checkIsCharacterMode(omikujiData: OmikujiDataType): boolean {
  const { featureUsage, characters, settings } = omikujiData
  const usageCharacters = featureUsage.usage.characters
  const hasCharacters = Object.keys(characters).length > 0
  const mode = resolveSettingMode(settings.licenseKeyHash)
  return hasAccessPure(usageCharacters, mode) && hasCharacters
}
