// src/MainGenerator/script/PostMessage.ts
import { PostActionType, PostActionWordPartyType, CharacterType } from '@/types/'
import { postWordParty, postComment, postSpeech } from '@shared/sdk/postMessage/PostOneComme'
import { ServiceManager } from './ServiceManager'
import { CommentRequestBuilder } from './CommentRequestBuilder'
import { ServiceAPI } from '@shared/sdk/service/ServiceAPI'
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost'

/**
 * メッセージ投稿を管理するクラス
 */
export class PostMessage {
  private readonly serviceAPI: ServiceAPI
  private readonly commentRequestBuilder: CommentRequestBuilder
  private readonly serviceManager: ServiceManager

  constructor(private readonly charactersMap: Record<string, CharacterType> = {}) {
    this.serviceAPI = ServiceAPI.getInstance()
    this.commentRequestBuilder = new CommentRequestBuilder()
    this.serviceManager = new ServiceManager(this.serviceAPI)
  }

  /**
   * 複数の投稿アクションを並列実行
   */
  async post(posts: (PostActionType | PostActionWordPartyType)[]): Promise<void> {
    try {
      const services = await this.serviceAPI.getServices()
      this.serviceManager.updateServices(services ?? [])

      await Promise.all(posts.map((post) => this.processPost(post)))
    } catch (error) {
      console.error('メッセージ投稿処理に失敗しました:', error)
      throw error
    }
  }

  private async processPost(post: PostActionType): Promise<void> {
    const { delaySeconds = 0 } = post

    // WordPartyの投稿
    if (post.actionType === 'wordParty') {
      postWordParty(post.wordParty, delaySeconds)
      return
    }

    // フキダシの投稿
    if (post.actionType === 'message') {
      const chara = this.getCharacter(post.characterKey)

      if (chara && chara?.frameId !== null) {
        await this.serviceManager.ensureServiceExists(chara)
      }

      if (post.message.bubble) {
        this.postMessage(post.message.bubble, chara, delaySeconds)
      }
    }
  }

  private getCharacter(characterKey: string): CharacterType | undefined {
    if (!characterKey || characterKey === '') return undefined
    return this.charactersMap[characterKey]
  }

  private postMessage(bubble: string, chara: CharacterType | undefined, delaySeconds: number): void {
    if (!chara) return

    if (this.shouldPostAsComment(chara)) {
      this.postAsComment(bubble, chara, delaySeconds)
    } else if (chara.displayOption.mode === 'voice') {
      postSpeech(bubble, delaySeconds)
    }
  }

  private shouldPostAsComment(chara: CharacterType): boolean {
    return chara.displayOption.mode === 'comment' && chara.frameId !== ''
  }

  private postAsComment(bubble: string, chara: CharacterType, delaySeconds: number): void {
    try {
      const request = this.commentRequestBuilder.createCommentRequest(bubble, chara)
      postComment(request, delaySeconds)
    } catch (error) {
      ConsolePost('error', `キャラクターコメント投稿エラー: ${chara.name}`, error)
    }
  }
}
