// src\MainGenerator\scripts\CharacterManager\CharacterManager.ts
import { CharacterType, OmikujiDataType, CharacterSchema, CharacterEmotionType } from '@/types/OmikujiData/'
import { resolveSettingMode } from '@/common/FeatureAccess/SettingMode'
import { hasAccessPure } from '@/common/FeatureAccess/useAccessChecker'

/**
 * キャラクター情報の解決とライセンス判定を一括管理
 */
export class CharacterManager {
  readonly characterMap: Map<string, CharacterType>
  readonly characterArray: CharacterType[]
  readonly isCharacterMode: boolean

  constructor(omikujiData: OmikujiDataType) {
    this.isCharacterMode = this.checkIsCharacter(omikujiData)
    this.characterMap = this.createCharacterMap(omikujiData)

    // Mapから配列を生成
    // UIに表示するための characterArray からは 'default' キーを除外する
    this.characterArray = Array.from(this.characterMap.values())
      .filter((char) => char.key !== 'default')
      .sort((a, b) => (a.order || 0) - (b.order || 0))
  }

  /**
   * キャラクターの妥当性を検証し、適切なキーと表情を返す
   * 画像の有無に関わらず、定義が存在すればそのキャラクターのキーを維持する
   */
  resolveCharacter(data: { characterKey: string | null; iconKey: CharacterEmotionType }) {
    const { characterKey, iconKey } = data

    // キャラクター定義が存在するか確認。存在しない場合のみ 'default' にフォールバック
    const exists = characterKey ? this.characterMap.has(characterKey) : false
    const resolvedCharacterKey = exists ? characterKey! : 'default'

    // 表情キーの妥当性を確認（画像がない表情なら、そのキャラの 'default' 画像を参照させる）
    const resolvedEmotion = this.resolveEmotion(resolvedCharacterKey, iconKey)

    return {
      ...data,
      characterKey: resolvedCharacterKey,
      iconKey: resolvedEmotion,
    }
  }

  /**
   * キャラクター情報を取得。見つからない場合は default を返す
   */
  getCharacter(characterKey: string | null): CharacterType {
    return this.characterMap.get(characterKey || 'default') || this.characterMap.get('default')!
  }

  /**
   * characterMapの生成（ライセンス無効時はデフォルトのみ保持）
   */
  private createCharacterMap(omikujiData: OmikujiDataType): Map<string, CharacterType> {
    const defaultCharacter = CharacterSchema.parse({
      key: 'default',
      name: 'System',
      color: omikujiData.components.bubble.defaultColor,
      image: {},
    })

    if (!this.isCharacterMode) {
      // キャラクターモードが無効な場合は、内部解決用に default のみを持つ
      return new Map([[defaultCharacter.key, defaultCharacter]])
    }

    const map = new Map<string, CharacterType>(Object.values(omikujiData.characters).map((char) => [char.key, char]))

    // 内部解決用に default キーを保持させる（UIには出さない）
    if (!map.has('default')) {
      map.set('default', defaultCharacter)
    }

    return map
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
   * 指定されたキャラクターが（画像アセットの有無にかかわらず）定義されているか確認
   */
  isValidCharacter(characterKey: string | null): boolean {
    if (!characterKey) return false
    // UI用のリストに含まれているかどうかで判定（defaultを除外したリスト）
    return this.characterArray.some((char) => char.key === characterKey)
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
  resolveEmotion(characterKey: string, iconKey: CharacterEmotionType): CharacterEmotionType {
    const character = this.characterMap.get(characterKey)
    if (!character) return 'default'

    const hasImage = character.image?.[iconKey]?.some((p) => p && p.trim()) ?? false
    return hasImage ? iconKey : 'default'
  }

  /**
   * キャラクターとアイコンから画像urlを返す
   */
  iconSrc(characterKey: string | null, iconKey: CharacterEmotionType): string[] {
    const key = characterKey || 'default'
    const char = this.characterMap.get(key)
    if (!char) return []

    // 指定された表情がなければ default 表情、それもなければ空配列
    const images = char.image?.[iconKey] || char.image?.['default'] || []
    return images.filter((p) => p && p.trim())
  }
}
