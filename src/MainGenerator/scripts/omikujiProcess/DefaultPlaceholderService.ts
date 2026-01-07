// src\MainGenerator\scripts\OmikujiProcess\DefaultPlaceholderService.ts
import {
  DefaultPlaceholdersCommentSchema,
  DefaultPlaceholdersMetaSchema,
} from '@/types/OmikujiProcess/DefaultPlaceholders'
import { ServiceMetaCondition } from '@shared/types'
import { createGetMetas } from '@shared/sdk/subscribe/GetMetas'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service'
import { useAppStore } from '@/MainGenerator/stores/useAppStore'

export class DefaultPlaceholderService {
  // TODO:将来、metaを参照としたおみくじを作成するため、AppStoreに移行するかも
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
  getDefaultComments(omiken?: OmikenCommentType): Record<string, string | number> {
    const base = this.getDefaultPlaceholders()

    // Comment がない場合は base のみ
    if (!omiken) return base

    // Comment がある場合は full スキーマで parse
    return DefaultPlaceholdersCommentSchema.parse({
      ...base,
      user: omiken.userName,
      userId: omiken.userId,
      price: omiken.giftPrice,
      lc: omiken.meta.lc,
      tc: omiken.meta.tc,
      draws: omiken.meta.draws,
    })
  }

  /**
   * timer用デフォルトのプレースホルダー情報を設定
   */
  getDefaultPlaceholders(): Record<ServiceMetaCondition, string | number> {
    const { userVisitManager } = useAppStore()
    const { commenter, winner } = userVisitManager.getLiveComment()

    return DefaultPlaceholdersMetaSchema.parse({
      viewer: this.serviceMeta?.viewer,
      upVote: this.serviceMeta?.upVote,
      commenter,
      winner,
    })
  }
}
