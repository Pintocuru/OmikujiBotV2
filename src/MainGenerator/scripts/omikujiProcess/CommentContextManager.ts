// src/MainGenerator/utils/commentProcessor/CommentContextManager.ts
// コメント処理のコンテキスト管理
import { DefaultPlaceholders } from '@/types/';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service';
import { createGetMetas } from '@omiken/shared/sdk/subscribe/GetMetas';
import { ServiceMetaCondition } from '@omiken/shared/types';

export class CommentContextManager {
 private serviceMeta: ServiceMeta | null = null;

 constructor() {
  this.initializeServiceMeta();
 }

 /**
  * 定期的にAPIから取得
  */
 private initializeServiceMeta(): void {
  createGetMetas().fetchMeta((meta) => {
   this.serviceMeta = meta;
  });
 }

 /**
  * comment用デフォルトのプレースホルダー情報を設定
  */
 setupDefaultPlaceholdersComment(comment: Comment): Record<DefaultPlaceholders, string | number> {
  return {
   user: comment.data.displayName || comment.data.name || 'テストユーザー',
   price: (comment.data as { price?: number })?.price ?? 0,
   lc: comment.meta?.lc ?? 0,
   tc: comment.meta?.tc ?? 0,
   ...this.setupDefaultPlaceholders()
  };
 }

 /**
  * timer用デフォルトのプレースホルダー情報を設定
  */
 setupDefaultPlaceholders(): Record<ServiceMetaCondition, string | number> {
  return {
   viewer: this.serviceMeta?.viewer ?? 0,
   upVote: this.serviceMeta?.upVote ?? 0
  };
 }
}
