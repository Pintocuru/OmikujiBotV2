// src\MainGenerator\scripts\OmikujiProcess\DefaultPlaceholderService.ts
import { useAppStore } from '@/MainGenerator/stores/useAppStore'
import {
  DefaultPlaceholdersCommentSchema,
  DefaultPlaceholdersMetaSchema,
} from '@/types/OmikujiProcess/DefaultPlaceholders'
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service'
import { createGetMetas } from '@shared/sdk/subscribe/GetMetas'
import { GetUserVisits } from '@shared/sdk/subscribe/GetUserVisits'
import { ConfigUserSchema, ServiceMetaCondition, ServiceVisitType } from '@shared/types'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

export class DefaultPlaceholderService {
  private serviceMeta: ServiceMeta | null = null
  private userVisits: Record<string, ServiceVisitType> | null = null

  constructor() {
    this.initializeServiceMeta()
  }

  /**
   * 定期的にAPIから取得
   * TODO:userVisits ではなく、MainGenerator のstoreから取得できないか？
   * ただし、コンフィグエディターでも使ってるので・・・どうする？
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
  getDefaultComments(omiken?: OmikenCommentType): Record<string, string | number> {
    const userList = Object.values(this.userVisits ?? {}).flatMap((v) => Object.values(v.user))
    const commenter = userList.length
    const winner = userList.length > 0 ? userList[Math.floor(Math.random() * userList.length)].name : ''

    const base = this.getDefaultPlaceholders()

    // Comment がない場合は base に Comment依存の値を付けず返す
    if (!omiken) {
      return {
        ...base,
        commenter,
        winner,
      }
    }

    // Comment がある場合は full スキーマで parse
    return DefaultPlaceholdersCommentSchema.parse({
      ...base,
      user: omiken.userName,
      price: omiken.giftPrice,
      lc: omiken.meta.lc,
      tc: omiken.meta.tc,
      draws: omiken.meta.draws,
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
