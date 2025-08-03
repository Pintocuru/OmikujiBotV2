// src/MainGenerator/utils/commentProcessor/BotMessageGenerator.ts
import {
 BotMessage,
 BotMessageSchema,
 CharacterEmotionType,
 CharacterType,
 PostActionType
} from '@type/';
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings';

export class BotMessageGenerator {
 constructor(private readonly characters: Record<string, CharacterType>) {}

 /**
  * 単一のPostActionからBotMessageを生成（複数の場合もあり）
  */
 generateMessage(postAction: PostActionType): BotMessage[] {
  const character = this.characters[postAction.characterKey];
  const messages: BotMessage[] = [];

  // messageContentが存在する場合
  if (postAction.messageContent?.trim()) {
   messages.push(
    BotMessageSchema.parse({
     name: character.name,
     profileImage: character.displayOption.isIconDisplay
      ? this.getCharacterIcon(character, postAction.iconKey)
      : null,
     comment: postAction.messageContent,
     isToast: false,
     color: character.color,
     delaySeconds: postAction.delaySeconds + POST_SETTINGS.basicDelaySeconds
    })
   );
  }

  // messageToastが存在する場合
  if (postAction.messageToast?.trim()) {
   messages.push(
    BotMessageSchema.parse({
     name: character.name,
     profileImage: character.displayOption.isIconDisplay
      ? this.getCharacterIcon(character, postAction.iconKey)
      : null,
     comment: postAction.messageToast,
     isToast: true,
     color: character.color,
     delaySeconds: postAction.delaySeconds + POST_SETTINGS.basicDelaySeconds
    })
   );
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
