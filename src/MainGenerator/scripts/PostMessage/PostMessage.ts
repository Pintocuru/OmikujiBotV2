// src/MainGenerator/script/PostMessage.ts
import { PostActionType, CharacterType, PostActionMessageType } from '@/types/'
import { postWordParty, postComment, postSpeech } from '@shared/sdk/postMessage/PostOneComme'
import { ServiceAPI } from '@shared/sdk/service/ServiceAPI'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'
import { Service } from '../../../../../../libs/onesdk/types/Service'
import { createCommentRequest, isServiceExists, shouldPostAsComment, shouldPostAsVoice } from './PostMessageHelper'

// メインクラス

/**
 * メッセージ投稿を管理するクラス
 */
export class PostMessage {
  private readonly serviceAPI: ServiceAPI
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

    if (post.actionType === 'message') {
      await this.processMessagePost(post, delaySeconds)
    } else if (post.actionType === 'wordParty') {
      postWordParty(post.wordParty, delaySeconds)
    }
  }

  /**
   * メッセージ投稿を処理
   */
  private async processMessagePost(post: PostActionMessageType, delaySeconds: number): Promise<void> {
    const { bubble } = post.message
    if (!bubble || bubble.trim() === '') return

    const chara = this.getCharacter(post.characterKey)

    // わんコメ投稿の処理
    if (chara && shouldPostAsComment(chara)) {
      await this.ensureServiceExists(chara)
      this.postAsComment(bubble, chara, delaySeconds)
    }

    // ボイス投稿の処理
    if (shouldPostAsVoice(chara, bubble)) {
      postSpeech(bubble, delaySeconds)
    }
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
      ConsolePost('error', `キャラクターコメント投稿エラー: ${chara.name}`, error)
    }
  }

  /**
   * キャラクターに対応するサービスが存在することを保証
   */
  private async ensureServiceExists(chara: CharacterType): Promise<void> {
    const frameId = chara.displayOption.frameId
    if (!frameId) return

    if (!isServiceExists(frameId, this.services, this.createdServiceIds)) {
      await this.createService(chara)
    }
  }

  /**
   * 新しいサービス(枠)を作成
   */
  private async createService(chara: CharacterType): Promise<void> {
    const frameId = chara.displayOption.frameId
    if (!frameId) return

    try {
      const newService = await this.serviceAPI.createService(chara.name, frameId, chara.color.backgroundColor)

      if (newService) {
        this.createdServiceIds.add(frameId)
        // サービス作成後に一覧を再取得
        const updatedServices = await this.serviceAPI.getServices()
        this.services = updatedServices ?? []
      }
    } catch (error) {
      console.error(`枠作成に失敗: ${chara.name} (${frameId})`, error)
      throw error
    }
  }
}
