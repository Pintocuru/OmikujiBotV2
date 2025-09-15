// src\MainGenerator\scripts\OmikujiProcess\DefaultPlaceholderService.ts
import {
  DefaultPlaceholders,
  DefaultPlaceholdersCommentSchema,
  DefaultPlaceholdersMetaSchema,
} from '@/types/OmikujiProcess/DefaultPlaceholders'
import { Comment } from '@onecomme.com/onesdk/'
import { ServiceMeta } from '@onecomme.com/onesdk/'
import { createGetMetas } from '@shared/sdk/subscribe/GetMetas'
import { GetUserVisits } from '@shared/sdk/subscribe/GetUserVisits'
import { ServiceMetaCondition, ServiceVisitType } from '@shared/types'

export class DefaultPlaceholderService {
  private serviceMeta: ServiceMeta | null = null
  private userVisits: Record<string, ServiceVisitType> | null = null

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
    GetUserVisits().fetchComments((userVisits) => {
      this.userVisits = userVisits
    })
  }

  /**
   * comment用デフォルトのプレースホルダー情報を設定
   */
  getDefaultComments(comment: Comment): Record<DefaultPlaceholders, string | number> {
    // TODO:v1.2に向けて、下記の実装
    const userList = Object.values(this.userVisits?.user ?? [])
    const commenter = userList.length
    const winner = userList.length > 0 ? userList[Math.floor(Math.random() * userList.length)].name : ''

    return DefaultPlaceholdersCommentSchema.parse({
      user: comment.data.displayName || comment.data.name,
      price: (comment.data as { price?: number })?.price,
      lc: comment.meta?.lc,
      tc: comment.meta?.tc,
      ...this.getDefaultPlaceholders(),
    })
  }

  /**
   * timer用デフォルトのプレースホルダー情報を設定
   */
  getDefaultPlaceholders(): Record<ServiceMetaCondition, string | number> {
    return DefaultPlaceholdersMetaSchema.parse({
      viewer: this.serviceMeta?.viewer,
      upVote: this.serviceMeta?.upVote,
    })
  }
}
