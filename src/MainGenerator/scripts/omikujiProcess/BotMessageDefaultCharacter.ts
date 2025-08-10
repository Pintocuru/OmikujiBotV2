// src\MainGenerator\scripts\omikujiProcess\BotMessageDefaultCharacter.ts
import { type CharacterType, type CharacterColorType, CharacterSchema } from '@/types/';

// デフォルトキャラクター用のカラーテーマ
const DEFAULT_COLOR_THEMES: CharacterColorType[] = [
 // 1. ソフトブルー
 {
  nameColor: '#1565C0',
  textColor: '#0D47A1',
  backgroundColor: '#E3F2FD'
 },
 // 2. ウォームオレンジ
 {
  nameColor: '#E65100',
  textColor: '#BF360C',
  backgroundColor: '#FFF3E0'
 },
 // 3. フレッシュグリーン
 {
  nameColor: '#2E7D32',
  textColor: '#1B5E20',
  backgroundColor: '#E8F5E8'
 },
 // 4. エレガントパープル
 {
  nameColor: '#7B1FA2',
  textColor: '#4A148C',
  backgroundColor: '#F3E5F5'
 },
 // 5. クラシックグレー
 {
  nameColor: '#424242',
  textColor: '#212121',
  backgroundColor: '#F5F5F5'
 }
];

// 空の画像セット（すべての感情で空文字列）
const EMPTY_IMAGE_SET = {
 default: '',
 happy: '',
 excited: '',
 laughing: '',
 blushing: '',
 surprised: '',
 sad: '',
 angry: '',
 thinking: '',
 wink: '',
 singing: '',
 sleepy: ''
};

// デフォルトキャラクターデータの生成
export const createDefaultCharacters = (): CharacterType[] => {
 return DEFAULT_COLOR_THEMES.map((colorTheme, index) =>
  CharacterSchema.parse({
   // PresetMetadataSchema fields
   id: `default-character-${index + 1}`,
   key: `default-${index + 1}`,
   name: `Botちゃん`,
   description: `システムデフォルトキャラクター（カラーテーマ${index + 1}）`,
   tags: ['default', 'system'],
   createdAt: new Date().toISOString(),
   updatedAt: new Date().toISOString(),

   // Character specific fields
   displayName: `Bot ${index + 1}`,
   frameId: '',
   displayOption: {
    isIconDisplay: false, // 画像がないため非表示
    isOneCommePost: true,
    isVoice: true
   },
   color: colorTheme,
   image: EMPTY_IMAGE_SET
  })
 );
};

// BotMessageGenerator内で使用するヘルパー関数
export class DefaultCharacterManager {
 private static defaultCharacters: CharacterType[] = createDefaultCharacters();

 /**
  * キャラクターが存在しない場合にデフォルトキャラクターを返す
  * @param characterKey - 要求されたキャラクターキー
  * @param availableCharacters - 利用可能なキャラクター配列
  * @returns 有効なキャラクターまたはデフォルトキャラクター
  */
 static getCharacterOrDefault(
  characterKey: string,
  availableCharacters: CharacterType[]
 ): CharacterType {
  // 利用可能なキャラクターから検索
  if (availableCharacters && availableCharacters.length > 0) {
   const foundCharacter = availableCharacters.find((char) => char.id === characterKey);
   if (foundCharacter) {
    return foundCharacter;
   }
  }

  // キャラクターが見つからない場合、デフォルトを返す
  // characterKeyのハッシュ値を使ってデフォルトキャラクターを選択
  const defaultIndex = this.getDefaultCharacterIndex(characterKey);
  return this.defaultCharacters[defaultIndex];
 }

 /**
  * キャラクターキーからデフォルトキャラクターのインデックスを決定
  * 同じキーに対しては常に同じキャラクターを返すようにする
  */
 private static getDefaultCharacterIndex(characterKey: string): number {
  if (!characterKey) {
   return 0;
  }

  // 簡単なハッシュ関数でキーからインデックスを生成
  let hash = 0;
  for (let i = 0; i < characterKey.length; i++) {
   const char = characterKey.charCodeAt(i);
   hash = (hash << 5) - hash + char;
   hash = hash & hash; // 32bit整数に変換
  }

  return Math.abs(hash) % this.defaultCharacters.length;
 }

 /**
  * 全てのデフォルトキャラクターを取得
  */
 static getAllDefaultCharacters(): CharacterType[] {
  return [...this.defaultCharacters];
 }

 /**
  * 特定のインデックスのデフォルトキャラクターを取得
  */
 static getDefaultCharacterByIndex(index: number): CharacterType {
  const validIndex = Math.max(0, Math.min(index, this.defaultCharacters.length - 1));
  return this.defaultCharacters[validIndex];
 }
}

// 使用例：BotMessageGeneratorでの使用方法
/*
// BotMessageGenerator内での使用例

export class BotMessageGenerator {
  // ... other methods

  generateMessage(action: PostActionType): BotMessageType {
    try {
      // 既存のロジック
      const character = DefaultCharacterManager.getCharacterOrDefault(
        action.characterKey,
        this.characters
      );

      return {
        id: generateId(),
        name: character.displayName,
        comment: action.messageContent,
        profileImage: character.image[action.iconKey] || character.image.default,
        color: character.color,
        createdAt: new Date()
      };

    } catch (error) {
      console.error('メッセージ生成エラー:', error);
      
      // エラー時も確実にメッセージを返す
      const fallbackCharacter = DefaultCharacterManager.getDefaultCharacterByIndex(0);
      return {
        id: generateId(),
        name: fallbackCharacter.displayName,
        comment: action.messageContent || 'メッセージの生成に失敗しました',
        profileImage: '',
        color: fallbackCharacter.color,
        createdAt: new Date()
      };
    }
  }
}
*/
