// src\MainGenerator\scripts\OmikujiProcess\DefaultPlaceholderService.ts
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import {
  DefaultPlaceholders,
  DefaultPlaceholdersCommentSchema,
  DefaultPlaceholdersMetaSchema,
} from '@/types/OmikujiProcess/DefaultPlaceholders'
import { Comment } from '@onecomme.com/onesdk/'
import { ServiceMeta } from '@onecomme.com/onesdk/'
import { createGetMetas } from '@shared/sdk/subscribe/GetMetas'
import { GetUserVisits } from '@shared/sdk/subscribe/GetUserVisits'
import { ConfigUserSchema, ServiceMetaCondition, ServiceVisitType } from '@shared/types'

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
    const { userConfig } = useAppStore()

    createGetMetas().fetchMeta((meta) => {
      this.serviceMeta = meta
    })
    // userVisits
    GetUserVisits(
      ConfigUserSchema.parse({
        isDiffMode: false,
        threshold: {
          ...userConfig.threshold,
          conditions: [...userConfig.threshold.conditions, 'service'],
          service: ['platforms'],
        },
      })
    ).fetchComments((userVisits) => {
      this.userVisits = userVisits
    })
  }

  /**
   * comment用デフォルトのプレースホルダー情報を設定
   */
  getDefaultComments(comment: Comment): Record<DefaultPlaceholders, string | number> {
    const userList = Object.values(this.userVisits ?? {}).flatMap((v) => Object.values(v.user))
    const commenter = userList.length
    const winner = userList.length > 0 ? userList[Math.floor(Math.random() * userList.length)].name : ''

    // TODO:おみくじ回数を追加すべきか？

    return DefaultPlaceholdersCommentSchema.parse({
      ...this.getDefaultPlaceholders(),
      user: comment.data.displayName || comment.data.name,
      price: (comment.data as { price?: number })?.price,
      lc: comment.meta?.lc,
      tc: comment.meta?.tc,
      commenter,
      winner,
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
