// src/MainGenerator/omikujiProcess/CharacterCollector.ts
import {
 BotMessage,
 CharacterType,
 OmikujiDataType,
 OmikujiSetType,
 PostActionType
} from '@/types/';

export class CharacterCollector {
 private readonly omikujiData: OmikujiDataType;

 constructor(omikujiData: OmikujiDataType) {
  this.omikujiData = omikujiData;
 }

 /**
  * postActionsからcharacterKeyを収集する
  */
 private extractCharacterKeys(
  rules: Record<string, { isEnabled: boolean; omikuji: OmikujiSetType[] }>
 ): Set<string> {
  const keys = new Set<string>();
  Object.values(rules).forEach((rule) => {
   if (!rule.isEnabled) return;
   rule.omikuji.forEach(({ postActions }) =>
    postActions.forEach(({ characterKey }) => {
     if (characterKey) keys.add(characterKey);
    })
   );
  });
  return keys;
 }

 /**
  * 有効なルールから使用されているキャラクターキーを収集する
  */
 private collectCharacterKeys(): Set<string> {
  const keys = new Set<string>();
  [this.omikujiData.comments, this.omikujiData.timers].forEach((ruleSet) => {
   this.extractCharacterKeys(ruleSet).forEach((key) => keys.add(key));
  });
  return keys;
 }

 /**
  * 使用されているキャラクターデータを取得する
  */
 getUsedCharacterData(): Record<string, CharacterType> {
  const keys = this.collectCharacterKeys();
  const characters = this.omikujiData.characters;
  return Object.fromEntries(
   Array.from(keys)
    .filter((key) => characters[key])
    .map((key) => [key, characters[key]])
  );
 }

 /**
  * 使用されているキャラクターのプリセットを配列で取得する
  */
 getUsedCharacterPresets(): CharacterType[] {
  return Object.values(this.getUsedCharacterData()).sort((a, b) => a.order - b.order);
 }

 /**
  * キャラクターコントロールパネル用テストメッセージ
  */
 generateTestMessage(postAction: PostActionType, isToast: boolean = false): BotMessage {
  const character = this.omikujiData.characters[postAction.characterKey];

  return {
   id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
   name: character?.name ?? '',
   profileImage: character.image[postAction.iconKey],
   timestamp: new Date().toISOString(),
   comment: postAction.messageContent,
   isToast,
   color: character?.color ?? '#000000',
   delaySeconds: 0
  };
 }
}
