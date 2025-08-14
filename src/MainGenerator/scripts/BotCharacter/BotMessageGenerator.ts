// src/MainGenerator/utils/commentProcessor/BotMessageGenerator.ts
import {
 BotMessage,
 BotMessageSchema,
 CharacterEmotionType,
 CharacterType,
 PostActionType
} from '@/types/';
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings';
import { DefaultCharacterManager } from './BotMessageDefaultCharacter';

export class BotMessageGenerator {
 constructor(private readonly characters: Record<string, CharacterType>) {}

 /**
  * 単一のPostActionからBotMessageを生成（複数の場合もあり）
  */
 generateMessage(postAction: PostActionType): BotMessage[] {
  // 安全にキャラクターを取得（存在しない場合はデフォルトキャラクターを使用）
  const character = this.getSafeCharacter(postAction.characterKey);

  const messages: BotMessage[] = [];
  const baseDelaySeconds = postAction.delaySeconds + POST_SETTINGS.basicDelaySeconds;

  // 共通のメッセージ作成ロジック
  const createMessage = (content: string, isToast: boolean): BotMessage => {
   return BotMessageSchema.parse({
    name: character.name,
    profileImage: character.displayOption.isIconDisplay
     ? this.getCharacterIcon(character, postAction.iconKey)
     : null,
    comment: content,
    isToast,
    color: character.color,
    delaySeconds: baseDelaySeconds
   });
  };

  // messageContentが存在する場合
  if (postAction.messageContent?.trim()) {
   messages.push(createMessage(postAction.messageContent, false));
  }

  // messageToastが存在する場合
  if (postAction.messageToast?.trim()) {
   messages.push(createMessage(postAction.messageToast, true));
  }

  return messages;
 }

 /**
  * 複数のPostActionからBotMessageの配列を生成
  */
 generateMessages(postActions: PostActionType[]): BotMessage[] {
  // messageContent または messageToast のいずれかが存在するアクションをフィルタリング
  const validActions = postActions.filter(
   (action) => action.messageContent?.trim() || action.messageToast?.trim()
  );

  if (validActions.length === 0) return [];

  // flatMapを使用して、各アクションから生成される複数のメッセージを平坦化
  return validActions.flatMap((action) => this.generateMessage(action));
 }

 /**
  * 安全にキャラクターを取得する
  * キャラクターが存在しない場合でもエラーを投げず、必ずキャラクターを返す
  * ユーザー入力データの不整合に対する防御的プログラミング
  */
 private getSafeCharacter(characterKey: string): CharacterType {
  try {
   return DefaultCharacterManager.getCharacterOrDefault(characterKey, this.characters);
  } catch (error) {
   // 万が一 DefaultCharacterManager でエラーが発生した場合の最終フォールバック
   // ユーザー体験を損ねないよう、ログ出力してデフォルトキャラクターで継続
   console.warn('Character resolution failed, using default character:', {
    characterKey,
    error: error instanceof Error ? error.message : error
   });
   return DefaultCharacterManager.getDefaultCharacterByIndex(0);
  }
 }

 /**
  * キャラクターアイコンの取得
  * 指定されたアイコンキーに対応するアイコンを取得し、存在しない場合はデフォルトアイコンを返す
  */
 private getCharacterIcon(character: CharacterType, iconKey: CharacterEmotionType): string | null {
  const iconMap = character?.image;
  if (!iconMap) return null;

  const iconValue = iconMap[iconKey];
  if (iconValue && iconValue !== '') return iconValue;

  const defaultIcon = iconMap['default'];
  return defaultIcon && defaultIcon !== '' ? defaultIcon : null;
 }
}
