// src/MainGenerator/scripts/PostOmikuji/PostOmikujiService.ts
import { PostFlowType, CharacterType, PostFlowMessageType, OmikujiDataType } from '@/types/'
import { BOT_ICON } from './BotIcon'
import { ServiceMetaStore } from '@main/stores/MetaState/MetaStateService'
import { CharacterManager } from '@main/scripts/CharacterManager/CharacterManager'
import { postComment, postSpeech, postSystemMessage } from '@shared/sdk/post/PostOneComme'
import { SendCommentType, SendCommentSchema } from '@shared/types/'
import { POST_SETTINGS } from '@shared/sdk/PostSettings'
import { ServiceAPI } from '@shared/sdk/service/ServiceAPI'
import { executeWordParty } from '@shared/sdk/post/PostWordParty'
import { Service } from '@onecomme.com/onesdk/types/Service'

const MAX_REPEAT_COUNT = 30

/**
 * メッセージ投稿を管理するクラス
 */
export class PostOmikujiService {
  private readonly serviceAPI = ServiceAPI.getInstance()
  private readonly serviceMetaStore = ServiceMetaStore.getInstance()
  private readonly characterManager: CharacterManager
  private readonly enableSecondary: boolean
  private readonly basicDelaySeconds: number
  private services: Service[] = []
  private createdServiceIds = new Set<string>()

  constructor(omikujiData: OmikujiDataType) {
    this.characterManager = new CharacterManager(omikujiData)
    this.enableSecondary = omikujiData.components.enableSecondary
    this.basicDelaySeconds = omikujiData.settings.basicDelaySeconds
  }

  /**
   * 複数の投稿アクションを並列実行
   */
  async post(posts: PostFlowType[]): Promise<void> {
    this.services = (await this.serviceAPI.getServices()) ?? []
    await Promise.all(posts.map((post) => this.processPost(post)))
  }

  //  Private: ディスパッチ
  private async processPost(post: PostFlowType): Promise<void> {
    // enableSecondary が false なら全部投稿
    if (post.actionType === 'message') {
      // Secondary なのに無効設定なら、何もしない（スキップ）
      if (this.enableSecondary && post.message.isToast) return
      await this.processMessagePost(post)
    }

    // WordParty の投稿
    if (post.actionType === 'wordParty') {
      await executeWordParty({
        wordParty: post.wordParty,
        wordPartyId: post.wordPartyId,
        repeat: this.resolveRepeatCount(post.repeat),
        delaySeconds: post.delaySeconds ?? 0,
      })
    }
  }

  //  Private: メッセージ投稿
  private async processMessagePost(post: PostFlowMessageType): Promise<void> {
    const bubble = cleanPostMessage(post.message.bubble)
    if (!bubble) return

    const { delaySeconds = 0, characterKey } = post
    const character = this.characterManager.getCharacter(characterKey)
    const displayOption = character?.displayOption ?? this.characterManager.getCharacterDefaultVoice()

    if (displayOption.mode === 'comment') {
      const frameId = await this.resolveFrameId(character)
      if (frameId) {
        this.postAsComment(bubble, character?.displayName, delaySeconds, frameId, displayOption.imageBase64)
      } else {
        postSpeech(bubble, this.withBasicDelay(delaySeconds))
      }
      return
    }

    if (displayOption.mode === 'voice') {
      postSpeech(bubble, this.withBasicDelay(delaySeconds))
    }
    // none / rpgVoice はわんコメ側では何もしない
  }

  private postAsComment(
    bubble: string,
    displayName: string = 'おみくじBOT',
    delaySeconds: number,
    frameId: string,
    imageBase64: string
  ): void {
    try {
      const sendComment = buildCommentRequest(frameId, bubble, displayName, imageBase64)
      postComment(sendComment, this.withBasicDelay(delaySeconds))
    } catch (error) {
      const msg = `キャラクターコメント投稿エラー: ${error}`
      console.error(msg)
      postSystemMessage(msg)
    }
  }

  private withBasicDelay(delay: number = 0): number {
    return delay + this.basicDelaySeconds
  }

  //  Private: サービス管理

  /**
   * キャラクターの frameId を解決し、未作成なら新規作成して返す。
   * 利用可能な枠がない場合は null を返す。
   */
  private async resolveFrameId(chara: CharacterType | null): Promise<string | null> {
    const frameId = chara?.displayOption.frameId || this.services[0]?.id || null
    if (!frameId) return null

    const alreadyExists = this.services.some((s) => s.id === frameId) || this.createdServiceIds.has(frameId)

    if (!alreadyExists) {
      await this.createService(chara, frameId)
    }
    return frameId
  }

  private async createService(chara: CharacterType | null, frameId: string): Promise<void> {
    const name = chara?.name ?? '新しい枠'
    const backgroundColor = chara?.color.backgroundColor ?? this.characterManager.defaultColor.backgroundColor

    const newService = await this.serviceAPI.createService(name, frameId, backgroundColor)
    if (newService) {
      this.createdServiceIds.add(frameId)
      this.services = (await this.serviceAPI.getServices()) ?? []
    }
  }

  //  Private: ユーティリティ

  private resolveRepeatCount(repeat?: number | 'viewer' | 'upVote'): number {
    if (!repeat) return 1
    if (typeof repeat === 'number') return Math.min(repeat, MAX_REPEAT_COUNT)

    const meta = this.serviceMetaStore.getCurrent()
    if (!meta) {
      console.warn('メタデータが取得できないため、repeat を 1 に設定します')
      return 1
    }
    const value = repeat === 'viewer' ? meta.viewer : meta.upVote
    return Math.min(Math.max(value, 1), MAX_REPEAT_COUNT)
  }
}

//  Module-level utilities

function cleanPostMessage(raw: string): string {
  return raw
    ? raw
        .replace(/\{\{[^}]+\}\}/g, '')
        .replace(/<<[^>]+>>/g, '')
        .trim()
    : ''
}

function buildCommentRequest(frameId: string, comment: string, name: string, imageBase64: string): SendCommentType {
  return SendCommentSchema.parse({
    service: { id: frameId },
    comment: {
      userId: POST_SETTINGS.botUserId,
      name,
      comment,
      profileImage: imageBase64,
      badges: [{ url: BOT_ICON, label: 'おみくじBOT' }],
      nickname: ' ',
    },
  })
}
