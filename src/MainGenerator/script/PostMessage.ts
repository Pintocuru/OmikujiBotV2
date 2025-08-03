// shared/sdk/postMessage/PostMessage.ts
// 250709_エイリアス変更
import { PostActionType, PostActionWordPartyType } from '../../types/OmikujiBot/OmikujiSchema';
import {
 CharacterColorType,
 CharacterEmotionType,
 CharacterType
} from '../../types/OmikujiBot/CharacterSchema';
import {
 SendCommentType,
 SendCommentSchema,
 DEFAULT_BASE64_IMAGE,
 ColorsSchema,
 SendCommentColorType
} from '../../../../../shared/types/subscribe/SendCommentSchema';
import {
 postWordParty,
 postComment,
 postSpeech
} from '../../../../../shared/sdk/postMessage/PostOneComme';
import { ServiceAPI } from '../../../../../shared/sdk/service/ServiceAPI';
import { POST_SETTINGS } from '../../../../../shared/sdk/postMessage/PostSettings';
import { Service } from '@onecomme.com/onesdk/types/Service';
import { ConsolePost } from '../../../../../shared/sdk/postMessage/ConsolePost';

/**
 * メッセージ投稿を管理するクラス
 */
export class PostMessage {
 private readonly serviceAPI: ServiceAPI;
 private readonly commentRequestBuilder: CommentRequestBuilder;
 private readonly serviceManager: ServiceManager;

 constructor(private readonly charactersMap: Record<string, CharacterType> = {}) {
  this.serviceAPI = ServiceAPI.getInstance();
  this.commentRequestBuilder = new CommentRequestBuilder();
  this.serviceManager = new ServiceManager(this.serviceAPI);
 }

 /**
  * 複数の投稿アクションを順次実行
  */
 async post(posts: (PostActionType | PostActionWordPartyType)[]): Promise<void> {
  try {
   // 投稿開始時に一度だけサービス情報を更新
   const services = await this.serviceAPI.getServices();
   this.serviceManager.updateServices(services ?? []);

   await Promise.all(
    posts.map(async (post) => {
     const chara = this.getCharacterFromPost(post);
     await this.processPost(post, chara);
    })
   );
  } catch (error) {
   console.error('メッセージ投稿処理に失敗しました:', error);
   throw error;
  }
 }

 private getCharacterFromPost(
  post: PostActionType | PostActionWordPartyType
 ): CharacterType | undefined {
  if (!('characterKey' in post)) return undefined;

  const { characterKey } = post;
  return characterKey && characterKey !== '' ? this.charactersMap[characterKey] : undefined;
 }

 private async processPost(
  post: PostActionType | PostActionWordPartyType,
  chara?: CharacterType
 ): Promise<void> {
  const { delaySeconds = 0 } = post;

  if (chara && this.shouldCreateService(chara)) {
   await this.serviceManager.ensureServiceExists(chara);
  }

  if (this.hasMessageContent(post)) {
   await this.postMessage(post, chara, delaySeconds);
  }

  if (this.hasWordParty(post) && post.wordParty) {
   postWordParty(post.wordParty, delaySeconds);
  }
 }

 private shouldCreateService(chara: CharacterType): boolean {
  return chara.displayOption.isIconDisplay && chara.frameId !== null;
 }

 private hasMessageContent(post: PostActionType | PostActionWordPartyType): post is PostActionType {
  return (
   'messageContent' in post && post.messageContent !== undefined && post.messageContent !== ''
  );
 }

 private hasWordParty(post: PostActionType | PostActionWordPartyType): boolean {
  return post.wordParty !== undefined && post.wordParty !== '';
 }

 private async postMessage(
  post: PostActionType,
  chara: CharacterType | undefined,
  delaySeconds: number
 ): Promise<void> {
  if (chara && chara.displayOption.isOneCommePost && chara.frameId !== '') {
   try {
    const request = this.commentRequestBuilder.createCommentRequest(post, chara);
    postComment(request, delaySeconds);
   } catch (error) {
    ConsolePost('error', `キャラクターコメント投稿エラー: ${chara.name}`, error);
   }
  } else {
   // frameId がない、または isOneCommePost が false の場合はスピーチで投稿
   postSpeech(post.messageContent, delaySeconds);
  }
 }
}

/**
 * サービス管理を担当するクラス
 */
class ServiceManager {
 private services: Service[] = [];
 private createdServiceIds: Set<string> = new Set();

 constructor(private readonly serviceAPI: ServiceAPI) {}

 updateServices(services: Service[]): void {
  this.services = services;
 }

 async ensureServiceExists(chara: CharacterType): Promise<void> {
  if (!chara.frameId) return;

  const serviceExists =
   this.services.some((s) => s.id === chara.frameId) || this.createdServiceIds.has(chara.frameId);

  if (!serviceExists) {
   try {
    const newService = await this.serviceAPI.createService(
     chara.name,
     chara.frameId,
     chara.color.backgroundColor
    );

    if (newService) {
     this.createdServiceIds.add(chara.frameId);
     // サービス作成後にサービス一覧を再取得して更新
     const updatedServices = await this.serviceAPI.getServices();
     this.services = updatedServices ?? [];
    }
   } catch (error) {
    console.error(`枠作成に失敗: ${chara.name} (${chara.frameId})`, error);
   }
  }
 }
}

/**
 * コメントリクエスト作成を担当するクラス
 */
class CommentRequestBuilder {
 /**
  * わんコメ投稿用のリクエストオブジェクトを作成
  */
 createCommentRequest(post: PostActionType, chara: CharacterType): SendCommentType {
  // チェックしたにも関わらず存在しない場合はエラーを投げる
  if (!chara.frameId || chara.frameId === '') {
   ConsolePost('error', `キャラクター「${chara.name}」にframeIdが設定されていません`);
  }

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

 // キャラクターIDをidに入れる関数(使わないが残しておく)
 private generateCommentId(characterId: string): string {
  return `${characterId}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
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
  const vagi = ColorsSchema.safeParse({
   headerBackgroundColor: color.backgroundColor,
   headerTextColor: color.nameColor,
   bodyBackgroundColor: color.backgroundColor,
   bodyTextColor: color.textColor
  });
  return vagi.success ? vagi.data : undefined;
 }
}
