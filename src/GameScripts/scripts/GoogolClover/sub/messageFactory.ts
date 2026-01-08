// src/GameScripts/GoogolClover/messageFactory.ts
import { CURRENCY_SYMBOL } from './constants'
import type { UserState } from './types'
import type { GameContext } from '../game'
import { formatShort, formatScoreText, calculateScoreValue } from './utils'
import { UserNameSchema } from '@shared/types/OmikenComment/OmikenCommentSchema'

/**
 * BotMessage型（bubble, user, ranking を分離）
 */
interface BotMessage {
  bubble: string
  user: {
    userId: string
    userName: string
    profileImage: string
  }
  ranking: {
    scriptKey: string
    listName: string
    symbol: string
    scoreText: string
    scoreValue: number
    isUniqueUser: boolean
  }
}

/**
 * 失敗メッセージの生成
 */
export function createFailureMessage(
  userName: string,
  multipliersDisplay: string,
  rankingKey: string,
  context: GameContext,
  successCount: number
): BotMessage {
  const user = UserNameSchema.parse(context)

  return {
    bubble: `${userName}はサイコロを振る! ${multipliersDisplay}!${userName}は奈落へと消えた。`,
    user,
    ranking: {
      scriptKey: rankingKey,
      listName: userName,
      symbol: `${successCount}回目`,
      scoreText: '0',
      scoreValue: 0,
      isUniqueUser: true,
    },
  }
}

/**
 * 目標達成メッセージの生成
 */
export function createGoalAchievedMessage(
  state: UserState,
  userName: string,
  multipliersDisplay: string,
  rankingKey: string,
  context: GameContext
): BotMessage {
  const user = UserNameSchema.parse(context)
  const finalDisplay = formatShort(state.funds, state.exp)
  const exitVoice = !state.isGoogol ? '出口への扉が開いた。' : ''
  const scoreText = formatScoreText(state.funds, state.exp)
  const scoreValue = calculateScoreValue(state.funds, state.exp) * 1000000

  return {
    bubble: `${userName}はサイコロを振る! ${multipliersDisplay}!${finalDisplay}${CURRENCY_SYMBOL}獲得!${exitVoice}`,
    user,
    ranking: {
      scriptKey: rankingKey,
      listName: userName,
      symbol: `${state.successCount}回目`,
      scoreText,
      scoreValue,
      isUniqueUser: true,
    },
  }
}

/**
 * 通常成功メッセージの生成
 */
export function createSuccessMessage(
  state: UserState,
  userName: string,
  multipliersDisplay: string,
  totalMultiplier: number,
  rankingKey: string,
  context: GameContext
): BotMessage {
  const user = UserNameSchema.parse(context)
  const currentDisplay = formatShort(state.funds, state.exp)
  const scoreText = formatScoreText(state.funds, state.exp)
  const scoreValue = calculateScoreValue(state.funds, state.exp) * 1000000

  return {
    bubble: `${userName}はサイコロを振る! ${multipliersDisplay}!${currentDisplay}${CURRENCY_SYMBOL}獲得!`,
    user,
    ranking: {
      scriptKey: rankingKey,
      listName: userName,
      symbol: `${state.successCount}回目`,
      scoreText,
      scoreValue,
      isUniqueUser: true,
    },
  }
}
