// src\MainGenerator\scripts\omikujiProcess\BotMessageDefaultCharacter.ts
import { type CharacterType, type CharacterColorType, CharacterSchema } from '@/types/';
import MersenneTwister from 'mersenne-twister';

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

// デフォルトキャラクターデータの生成
export const createDefaultCharacters = (): CharacterType[] => {
 return DEFAULT_COLOR_THEMES.map((colorTheme, index) =>
  CharacterSchema.parse({
   // PresetMetadataSchema fields
   key: `default-${index + 1}`,
   name: `おみくじBOT`,
   displayName: `おみくじBOT`,
   displayOption: {
    isIconDisplay: false, // 画像がないため非表示
    isOneCommePost: false,
    isVoice: true
   },
   color: colorTheme
  })
 );
};

// BotMessageGenerator内で使用するヘルパー関数
export class DefaultCharacterManager {
 private static defaultCharacters: CharacterType[] = createDefaultCharacters();

 /**
  * キャラクターが存在しない場合にデフォルトキャラクターを返す
  */
 static getCharacterOrDefault(
  characterKey: string,
  availableCharacters: Record<string, CharacterType>
 ): CharacterType {
  const charactersArray = Object.values(availableCharacters);

  if (charactersArray.length > 0) {
   const foundCharacter = charactersArray.find((char) => char.id === characterKey);
   if (foundCharacter) {
    return foundCharacter;
   }
  }

  // 見つからない場合は日替わりデフォルトキャラ
  const defaultIndex = this.getDefaultCharacterIndex(characterKey);
  return this.defaultCharacters[defaultIndex];
 }

 /**
  * 今日の日付 + characterKey からデフォルトキャラクターのインデックスを決定
  */
 private static getDefaultCharacterIndex(characterKey: string): number {
  const todaySeed = this.getTodaySeed(characterKey);
  const mt = new MersenneTwister(todaySeed);
  return Math.floor(mt.random() * this.defaultCharacters.length);
 }

 /**
  * 今日の日付とキーからシード値を生成
  */
 private static getTodaySeed(characterKey: string): number {
  const today = new Date();
  const dateStr = `${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`;

  // characterKey を数値化して日付と合算
  let hash = 0;
  for (let i = 0; i < characterKey.length; i++) {
   hash = (hash << 5) - hash + characterKey.charCodeAt(i);
   hash |= 0;
  }
  return Math.abs(hash + Number(dateStr));
 }

 static getAllDefaultCharacters(): CharacterType[] {
  return [...this.defaultCharacters];
 }

 static getDefaultCharacterByIndex(index: number): CharacterType {
  const validIndex = Math.max(0, Math.min(index, this.defaultCharacters.length - 1));
  return this.defaultCharacters[validIndex];
 }
}
