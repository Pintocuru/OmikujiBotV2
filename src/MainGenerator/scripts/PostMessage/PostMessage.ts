// src/MainGenerator/script/PostMessage.ts
import { PostActionType, CharacterType, PostActionMessageType } from '@/types/'
import {
  postWordParty,
  postComment,
  postSpeech,
  postSystemMessage,
  postWordPartyId,
} from '@shared/sdk/postMessage/PostOneComme'
import { ServiceAPI } from '@shared/sdk/service/ServiceAPI'
import { createCommentRequest, isServiceExists, shouldPostAsComment, shouldPostAsVoice } from './PostMessageHelper'
import { Service } from '@onecomme.com/onesdk/types/Service'
import { MetaStateService } from '@main/scripts/MetaState/MetaStateService'
import { executeWordParty } from '@shared/sdk/postMessage/PostWordParty'

const MAX_REPEAT_COUNT = 30

/**
 * メッセージ投稿を管理するクラス
 */
export class PostMessage {
  private readonly serviceAPI: ServiceAPI
  private readonly metaStateService = MetaStateService.getInstance()
  private services: Service[] = []
  private createdServiceIds: Set<string> = new Set()

  constructor(private readonly charactersMap: Record<string, CharacterType> = {}) {
    this.serviceAPI = ServiceAPI.getInstance()
  }

  /**
   * 複数の投稿アクションを並列実行
   */
  async post(posts: PostActionType[]): Promise<void> {
    try {
      // サービス一覧を取得・更新
      const services = await this.serviceAPI.getServices()
      this.services = services ?? []

      await Promise.all(posts.map((post) => this.processPost(post)))
    } catch (error) {
      console.error('メッセージ投稿処理に失敗しました:', error)
      throw error
    }
  }

  /**
   * 単一の投稿アクションを処理
   */
  private async processPost(post: PostActionType): Promise<void> {
    const { delaySeconds = 0 } = post

    if (post.actionType === 'message' && !post.message.isToast) {
      await this.processMessagePost(post, delaySeconds)
    } else if (post.actionType === 'wordParty') {
      await executeWordParty({
        wordParty: post.wordParty,
        wordPartyId: post.wordPartyId,
        repeat: this.getRepeatCount(post.repeat),
        delaySeconds,
      })
    }
  }

  /**
   * repeat の値から実際の繰り返し回数を取得
   */
  private getRepeatCount(repeat?: number | 'viewer' | 'upVote'): number {
    // repeat が未指定の場合はデフォルト1回
    if (!repeat) return 1

    // 数値で直接指定されている場合
    if (typeof repeat === 'number') return Math.min(repeat, MAX_REPEAT_COUNT)

    // メタデータから取得する場合
    const meta = this.metaStateService.getCurrent()
    if (!meta) {
      console.warn('メタデータが取得できないため、repeat を 1 に設定します')
      return 1
    }

    const value = repeat === 'viewer' ? meta.viewer : meta.upVote
    return Math.min(Math.max(value, 1), MAX_REPEAT_COUNT)
  }

  /**
   * メッセージ投稿を処理
   */
  private async processMessagePost(post: PostActionMessageType, delaySeconds: number): Promise<void> {
    let { bubble } = post.message
    if (!bubble || bubble.trim() === '') return

    // ★ 投稿用にクリーンアップ
    bubble = cleanPostMessage(bubble)
    const chara = this.getCharacter(post.characterKey)

    // わんコメ投稿
    if (chara && shouldPostAsComment(chara)) {
      const frameId = await this.ensureServiceExists(chara)
      if (frameId) this.postAsComment(bubble, chara, delaySeconds)
      else postSpeech(bubble, delaySeconds)
      return
    }

    // ボイス投稿
    if (shouldPostAsVoice(chara, bubble)) postSpeech(bubble, delaySeconds)
  }

  /**
   * キャラクター情報を取得
   */
  private getCharacter(characterKey: string): CharacterType | null {
    if (!characterKey) return null
    return this.charactersMap[characterKey] ?? null
  }

  /**
   * わんコメとしてコメント投稿
   */
  private postAsComment(bubble: string, chara: CharacterType, delaySeconds: number): void {
    try {
      const request = createCommentRequest(bubble, chara)
      postComment(request, delaySeconds)
    } catch (error) {
      const msg = `キャラクターコメント投稿エラー: ${chara.name} ${error}`
      console.error(msg)
      postSystemMessage(msg)
    }
  }

  /**
   * キャラクターに対応するサービスが存在することを保証
   */
  private async ensureServiceExists(chara: CharacterType): Promise<string | null> {
    const frameId = chara.displayOption.frameId
    if (!frameId || frameId.trim() === '') return null

    if (!isServiceExists(frameId, this.services, this.createdServiceIds)) {
      return await this.createService(chara, frameId)
    }
    return frameId
  }

  /**
   * 新しいサービス(枠)を作成
   */
  private async createService(chara: CharacterType, frameId: string): Promise<string> {
    try {
      const newService = await this.serviceAPI.createService(chara.name, frameId, chara.color.backgroundColor)

      if (newService) {
        this.createdServiceIds.add(frameId)
        // サービス作成後に一覧を再取得
        const updatedServices = await this.serviceAPI.getServices()
        this.services = updatedServices ?? []
      }
      return frameId
    } catch (error) {
      console.error(`枠作成に失敗: ${chara.name} (${frameId})`, error)
      throw error
    }
  }
}

export function cleanPostMessage(raw: string): string {
  if (!raw) return ''
  return raw
    .replace(/\{\{[^}]+\}\}/g, '') // {{...}} を削除
    .replace(/<<[^>]+>>/g, '') // <<...>> を削除
    .trim() // 前後の空白を整える
}
