// src/MainGenerator/script/PostMessage/CommentRequestBuilder.ts
import { PostActionType, CharacterColorType, CharacterType } from '@/types/';
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

  // imageBase64が存在する場合はそちらを優先。ない場合はデフォルト画像を使用
  const profileImage =
   chara.imageBase64?.[post.iconKey] || chara.imageBase64?.default || DEFAULT_BASE64_IMAGE;

  return SendCommentSchema.parse({
   service: { id: chara.frameId },
   comment: {
    userId: POST_SETTINGS.botUserId,
    name: chara.displayName || 'おみくじBOT',
    comment: post.messageContent,
    profileImage: profileImage,
    badges: [{ url: botIcon, label: 'おみくじBOT' }],
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

const botIcon =
 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAoVJREFUWEftl7+LE0EVx79vdsN1CoKFVlEEFc0GGzUR4dJ7ldmANiZ/gJz/gXf/wYl/QM5GIclV2ieFN1FBxY2ghehW2oigrXFHZjezbJLNzuS8FQ/cct7beZ/3Y2beIxh8la7Xt0CbT93SwEAdlx+9LpJttYeuU9Ppk05ByqvdNxsgusXrzgkTfQlMBJ/XnZZO3whAesQKVh9CPOBueUNuGq7ZrAlBPiPyVXSWhTUCiA0WrL4Q8AlYnfOM4CsZA9VM02UEoHKaajglxgIYmORf/moEEOZUek3wQ3sCxdTcSrmSRTWgrRktQGwcAHedUD+5pkCU11FtWJ/CdcK2rhAzAaodrwlCe7JZ7FEWQHRqPKHAdPWQCTBnyCQFsynSpCI7AglPdOc5S54VhYUAU+H/E+sA9gQgi8m27fRqXxJoPB77z25ciE7QzLcwAhJgSTsL1RcZj++BKztvayIIuiD6KAJ2c9g496Ha89oQaO4LhECLN5ztSuflKULhIQgniTF39/p5eb+Ex+YdgDPRJSN2eKNczwOg2vW6AOoTp95z1zmrAOJzC9AL7pYu5QMweg6Iiyqq8mJTAN8BHIoEfw3gB3edw/8B/pkIJIvwC3dLx3Mqws+AOJZShKPHgLgW1SDd4/XSnVwAeqMtCLEeAYgn3C2vhSm42nl1NGD2VhDg27Dh3A7vhhwuIrlvpefdZ8CRwsrK+mDt9NfFj1FOAMZvQV4ROEAAchgB3d2Px2jP/QArWBIgmgFmO2HVninCpDwpSwwzac5ou2L1UzjxTCKS1vdP949iU01QuggeIIDpFn2u35+KwKQB0Xkfd0QmivF4RigyQa3Z2S8pD37+qmW1YUl7vwBuy5AwCoRj1wAAAABJRU5ErkJggg==';
