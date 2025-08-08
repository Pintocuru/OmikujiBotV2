// src/MainGenerator/utils/commentProcessor/BotMessageGenerator.ts
import {
 BotMessage,
 BotMessageSchema,
 CharacterEmotionType,
 CharacterType,
 PostActionType
} from '@/types/';
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings';

export class BotMessageGenerator {
 constructor(private readonly characters: Record<string, CharacterType>) {}

 /**
  * 単一のPostActionからBotMessageを生成（複数の場合もあり）
  */
 generateMessage(postAction: PostActionType): BotMessage[] {
  let character;
  const messages: BotMessage[] = [];

  try {
   // 存在しないキーでアクセスした場合にエラーを捕捉
   character = this.characters[postAction.characterKey];
   if (!character) {
    throw new Error(`Character with key "${postAction.characterKey}" not found.`);
   }

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
  } catch (error) {
   // エラーが発生した場合（characterが存在しない場合）の代替処理
   character = this.characters[0];
   if (error instanceof Error) console.error(error.message);

   // ユーザーへの通知メッセージを追加
   messages.push(
    BotMessageSchema.parse({
     name: 'error',
     profileImage: null,
     comment: `キャラクター "${postAction.characterKey}" が設定されていないおみくじがあるよ。コンフィグエディターで設定してね。`,
     isToast: true,
     color: {
      nameColor: '#212121',
      textColor: '#212121',
      backgroundColor: '#ff9800'
     },
     delaySeconds: 5
    })
   );
   return messages;
  }
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
