// src/MainGenerator/utils/commentProcessor/CommentContextManager.ts
// コメント処理のコンテキスト管理
import {
  DefaultPlaceholders,
  DefaultPlaceholdersCommentSchema,
  DefaultPlaceholdersMetaSchema,
} from '@/types/OmikujiProcess/DefaultPlaceholders'
import { Comment } from '@onecomme.com/onesdk/types/Comment'
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service'
import { createGetMetas } from '@shared/sdk/subscribe/GetMetas'
import { ServiceMetaCondition } from '@shared/types'

export class CommentContextManager {
  private serviceMeta: ServiceMeta | null = null

  constructor() {
    this.initializeServiceMeta()
  }

  /**
   * 定期的にAPIから取得
   */
  private initializeServiceMeta(): void {
    createGetMetas().fetchMeta((meta) => {
      this.serviceMeta = meta
    })
  }

  /**
   * comment用デフォルトのプレースホルダー情報を設定
   */
  setupDefaultPlaceholdersComment(comment: Comment): Record<DefaultPlaceholders, string | number> {
    return DefaultPlaceholdersCommentSchema.parse({
      user: comment.data.displayName || comment.data.name,
      price: (comment.data as { price?: number })?.price,
      lc: comment.meta?.lc,
      tc: comment.meta?.tc,
      ...this.setupDefaultPlaceholders(),
    })
  }

  /**
   * timer用デフォルトのプレースホルダー情報を設定
   */
  setupDefaultPlaceholders(): Record<ServiceMetaCondition, string | number> {
    return DefaultPlaceholdersMetaSchema.parse({
      viewer: this.serviceMeta?.viewer,
      upVote: this.serviceMeta?.upVote,
    })
  }
}
