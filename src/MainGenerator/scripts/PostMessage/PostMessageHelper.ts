// src\MainGenerator\scripts\PostMessage\PostMessageHelper.ts
import { CharacterType } from '@/types/'
import { SendCommentType, SendCommentSchema } from '@shared/types/'
import { POST_SETTINGS } from '@shared/sdk/postMessage/PostSettings'
import { Service } from '@onecomme.com/onesdk/types/Service'
import { postSystemMessage } from '@shared/sdk/postMessage/PostOneComme'

/**
 * わんコメ投稿用のリクエストオブジェクトを作成
 */
export function createCommentRequest(bubble: string, chara: CharacterType): SendCommentType {
  if (!chara.displayOption.frameId) {
    const msg = `キャラクター「${chara.name}」にframeIdが設定されていません`
    postSystemMessage(msg)
    throw new Error(msg)
  }

  return SendCommentSchema.parse({
    service: { id: chara.displayOption.frameId },
    comment: {
      userId: POST_SETTINGS.botUserId,
      name: chara.displayName || 'おみくじBOT',
      comment: bubble,
      profileImage: chara.displayOption.imageBase64,
      badges: [{ url: BOT_ICON, label: 'おみくじBOT' }],
      nickname: ' ',
    },
  })
}

/**
 * コメント投稿が必要かどうか判定
 */
export function shouldPostAsComment(chara: CharacterType): boolean {
  return chara.displayOption.mode === 'comment' && chara.displayOption.frameId !== ''
}

/**
 * ボイス投稿が必要かどうか判定
 */
export function shouldPostAsVoice(chara: CharacterType | null, bubble: string): boolean {
  if (!bubble) return false
  if (!chara) return true // キャラクター情報がない場合はボイスのみ
  return chara.displayOption.mode === 'voice'
}

/**
 * サービスが存在するか確認
 */
export function isServiceExists(frameId: string, services: Service[], createdIds: Set<string>): boolean {
  return services.some((s) => s.id === frameId) || createdIds.has(frameId)
}

// androidのドロイド君のアイコン素材
// https://icooon-mono.com/00053-android%E3%81%AE%E3%83%89%E3%83%AD%E3%82%A4%E3%83%89%E5%90%9B%E3%81%AE%E3%82%A2%E3%82%A4%E3%82%B3%E3%83%B3%E7%B4%A0%E6%9D%90/
const BOT_ICON =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAmxJREFUOE+N0s1vjFEUBvDnue870071AxXRRLvwEdXSLmh9jChCRNRHLJrYCrqR2LPQf6ALkdhZkC50SCOiFggWlAiJShtKQkIjjQWdaWn7vnPPIx00RSPu6pzF/eXcex5i1tlz803Rl9zksgS50EsjoRD5gFTgSB9VCxoXFg09ique+HWNfwLZ3HgDgvAgHACTwSEBrzGQhNe1qWw89Kx9fTwnsKHrcXmYLGmVQ7uk+YSrAESKHwQbMYeL5WW4e2t349e/gG0d98KpNQvWUu4MoBoBEcF6CDGIPglFjvqYp+ussTWDV9rop5GZJ6QvPCizsvJ9JE8KVkzBgawEGJP2QYYKOI5D7iyTYe/DA7VjBWDdUyWC96/KQ0QBPPeC2AowBbNQBAkaSD/dg8wBujUVx3eC4nnyNbU5bux5vZo+avLw70KwBbLlcAxmf+5MTTdGqg/GIXOss3z0lJuuvjhOYb+EJyS2gFgJKTE3wFEJtwkOQ9ohs+vcfLX/tMBDTngEYosMdSDmBoBRETcpDAPYBbMebs78BDgNMC1T/X8B5M4CkL7Sf1RgK6DnBFslNPwLoON1eBsQmTboBjdlBleI1kDZN+d4SoaN/5wA6HaB6/Jeiyn3gtMBmmheWhLGvkpR3FlYo1SqHyGJf0RFiUIvfKLjpSjGOVdRnE2lhr/NBKkpM7AkSR0R1AKgUUBIYhBWkOoF5Ak8ppBJIeq907Y++1sS6zIDyflBVAVLrAJ0TECpqPOhnIw4AWiCxvOatP7k28+f73dsz/8G/Np7c8/LyiAfHQRQmsdUN1CCZIjDMnk4u9x3qPHT7Ix8BzxYLSm1dzU/AAAAAElFTkSuQmCC'
