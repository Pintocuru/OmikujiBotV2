// src/MainGenerator/script/PostMessage.ts
// 250709_エイリアス変更
import { PostActionType, PostActionWordPartyType, CharacterType } from '@type/';
import { postWordParty, postComment, postSpeech } from '@shared/sdk/postMessage/PostOneComme';
import { ServiceManager } from './PostMessage/ServiceManager';
import { CommentRequestBuilder } from './PostMessage/CommentRequestBuilder';
import { ServiceAPI } from '@shared/sdk/service/ServiceAPI';
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost';

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

  const shouldPostMessage =
   'messageContent' in post && post.messageContent !== undefined && post.messageContent !== '';

  const shouldPostWordParty = post.wordParty !== undefined && post.wordParty !== '';

  if (chara?.displayOption.isIconDisplay && chara.frameId !== null) {
   await this.serviceManager.ensureServiceExists(chara);
  }

  if (shouldPostMessage) {
   await this.postMessage(post as PostActionType, chara, delaySeconds);
  }

  if (shouldPostWordParty && post.wordParty) {
   postWordParty(post.wordParty, delaySeconds);
  }
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
