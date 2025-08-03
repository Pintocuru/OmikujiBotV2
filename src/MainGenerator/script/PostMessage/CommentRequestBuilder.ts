// src/MainGenerator/script/PostMessage/CommentRequestBuilder.ts
import { PostActionType, CharacterColorType, CharacterEmotionType, CharacterType } from '@type/';
import {
 SendCommentType,
 SendCommentSchema,
 DEFAULT_BASE64_IMAGE,
 ColorsSchema,
 SendCommentColorType
} from '@shared/types/';
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings';
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost';

/**
 * コメントリクエスト作成を担当するクラス
 */
export class CommentRequestBuilder {
 /**
  * わんコメ投稿用のリクエストオブジェクトを作成
  */
 createCommentRequest(post: PostActionType, chara: CharacterType): SendCommentType {
  this.validateCharacter(chara);

  return SendCommentSchema.parse({
   service: { id: chara.frameId },
   comment: {
    userId: POST_SETTINGS.botUserId,
    name: chara.displayName || 'おみくじBOT',
    comment: post.messageContent,
    profileImage: this.getCharacterImagePath(chara, post.iconKey),
    badges: [], // TODO:何らかのBOTのアイコンがあってもいいね
    nickname: ' ', // おみくじBOTでは名前を呼ばない
    color: this.getSendCommentColor(chara.color)
   }
  });
 }

 private validateCharacter(chara: CharacterType): void {
  if (!chara.frameId || chara.frameId === '') {
   const errorMessage = `キャラクター「${chara.name}」にframeIdが設定されていません`;
   ConsolePost('error', errorMessage);
   throw new Error(errorMessage);
  }
 }

 private getCharacterImagePath(chara: CharacterType, iconKey: CharacterEmotionType): string {
  if (!chara.displayOption.isIconDisplay) return '';

  // このコードがscripts にあるとき、root>custom>templates>わんコメrootまで戻り、
  // そこから逆戻りして Characters を参照する
  // TODO:これの実装
  const directory = '../../../../templates/custom/XXX/Characters/';

  const fallbackPath = `/Characters/${chara.name}/${iconKey}.png`;
  console.warn(`パス: ${fallbackPath}`);

  const charaImage = chara.image[iconKey];
  if (charaImage !== '') return charaImage;
  if (chara.image.default !== '') return chara.image.default;

  console.warn(
   `キャラクター「${chara.name}」に画像が設定されていません。システムデフォルト画像を使用します。`
  );
  return DEFAULT_BASE64_IMAGE;
 }

 private getSendCommentColor(color: CharacterColorType): SendCommentColorType | undefined {
  const parseResult = ColorsSchema.safeParse({
   headerBackgroundColor: color.backgroundColor,
   headerTextColor: color.nameColor,
   bodyBackgroundColor: color.backgroundColor,
   bodyTextColor: color.textColor
  });
  return parseResult.success ? parseResult.data : undefined;
 }

 // キャラクターIDをidに入れる関数(使わないが残しておく)
 private generateCommentId(characterId: string): string {
  return `${characterId}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
 }
}
