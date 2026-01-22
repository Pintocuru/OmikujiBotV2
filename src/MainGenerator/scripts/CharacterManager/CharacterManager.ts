// src\MainGenerator\scripts\CharacterManager\CharacterManager.ts
import { CharacterType, OmikujiDataType, CharacterEmotionType, CharacterColorType } from '@/types/OmikujiData/'
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

  constructor(omikujiData: OmikujiDataType) {
    this.isCharacterMode = this.checkIsCharacter(omikujiData)
    this.characterMap = this.createCharacterMap(omikujiData.characters)
    this.defaultColor = omikujiData.components.bubble.defaultColor

    // Mapから配列を生成（全キャラクターを含む）
    this.characterArray = Array.from(this.characterMap.values()).sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  /**
   * キャラクターの妥当性を検証し、適切なキーと表情を返す
   * 画像の有無に関わらず、定義が存在すればそのキャラクターのキーを維持する
   */
  resolveCharacter(data: { characterKey: string | null; iconKey: CharacterEmotionType }) {
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

    const images = char.image?.default
    return Array.isArray(images) && images.some((p) => p && p.trim())
  }

  /**
   * 指定された表情の画像アセットが存在するか確認。ない場合はキャラクター自体の 'default' 画像を返す
   */
  resolveEmotion(characterKey: string | null, iconKey: CharacterEmotionType): CharacterEmotionType {
    if (!characterKey) return 'default'
    const character = this.characterMap.get(characterKey)
    if (!character) return 'default'

    const hasImage = character.image?.[iconKey]?.some((p) => p && p.trim()) ?? false
    return hasImage ? iconKey : 'default'
  }

  /**
   * キャラクターとアイコンから画像urlを返す
   */
  iconSrc(characterKey: string | null, iconKey: CharacterEmotionType): string[] {
    if (!characterKey) return []

    const char = this.characterMap.get(characterKey)
    if (!char) return []

    // 指定された表情がなければ default 表情、それもなければ空配列
    const images = char.image?.[iconKey] || char.image?.['default'] || []
    return images.filter((p) => p && p.trim())
  }
}
