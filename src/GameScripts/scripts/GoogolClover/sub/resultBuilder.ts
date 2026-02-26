// src/GameScripts/scripts/GoogolClover/sub/resultBuilder.ts
import { CURRENCY_SYMBOL, GOAL_EXPONENT } from './constants'
import { BotMessageExtraSchema, BotMessageExtraType } from '@/types'
import type { UserState, SlotExecutionResult } from './types'
import type { GameExecutionResult } from './game'
import { calculateScoreValue, formatScoreText, formatShort } from './utils'
import { UserNameSchema, UserNameType } from '@shared/types'

const RANKING_KEY = 'GoogolClover'

/**
 * スロット実行結果からゲーム結果を構築
 */
export function buildGameResult(result: SlotExecutionResult, user: UserNameType): GameExecutionResult {
  const { failedAt, multipliers } = result
  const multipliersDisplay = multipliers.map((m) => `${m}`).join('×')
  const userName = user.userName

  // 失敗時
  if (failedAt > 0) {
    return {
      bubble: `${userName}はサイコロを振る! ${multipliersDisplay}! ${userName}は奈落へと消えた。`,
      botMessageExtra: createFailureRankingData(user, result.state.successCount),
      shouldDeleteState: true,
      newState: null,
    }
  }

  // 成功時: 資金を更新して正規化
  const updatedState = normalizeState({
    ...result.state,
    funds: result.state.funds * result.totalMultiplier,
  })

  // 目標達成チェック
  if (updatedState.exp >= GOAL_EXPONENT) {
    return {
      bubble: createSuccessBubble(updatedState, userName, multipliersDisplay),
      botMessageExtra: createSuccessRankingData(updatedState, user, true),
      shouldDeleteState: false,
      newState: updatedState,
    }
  }

  // 通常の成功
  return {
    bubble: createSuccessBubble(updatedState, userName, multipliersDisplay),
    botMessageExtra: createSuccessRankingData(updatedState, user),
    shouldDeleteState: false,
    newState: updatedState,
  }
}

/**
 * 資金の正規化（純粋関数）
 */
function normalizeState(state: UserState): UserState {
  const NORMALIZATION_THRESHOLD = 10
  const NORMALIZATION_DIVISOR = 10
  let { funds, exp } = state

  while (funds >= NORMALIZATION_THRESHOLD) {
    funds /= NORMALIZATION_DIVISOR
    exp++
  }

  return { ...state, funds, exp }
}

/**
 * 成功時のbubbleメッセージ
 */
function createSuccessBubble(state: UserState, userName: string, multipliersDisplay: string): string {
  const currentDisplay = formatShort(state.funds, state.exp)

  return `${userName}はサイコロを振る! ${multipliersDisplay}! ${currentDisplay}${CURRENCY_SYMBOL}獲得!`
}

/**
 * 失敗時のランキングデータ
 */
function createFailureRankingData(user: UserNameType, successCount: number): BotMessageExtraType {
  return BotMessageExtraSchema.parse({
    scriptKey: RANKING_KEY,
    user: UserNameSchema.parse(user),
    lists: {
      listName: user.userName,
      symbol: `${successCount}回目`,
      text: '0',
      order: 0,
      isUnique: true,
    },
  })
}

/**
 * 成功時のランキングデータ
 */
function createSuccessRankingData(state: UserState, user: UserNameType, isGoogol = false): BotMessageExtraType {
  const scoreText = formatScoreText(state.funds, state.exp)
  const scoreValue = calculateScoreValue(state.funds, state.exp) * 1000000

  return BotMessageExtraSchema.parse({
    componentKey: RANKING_KEY,
    user: UserNameSchema.parse(user),
    lists: {
      listName: user.userName,
      symbol: `${state.successCount}回目`,
      text: scoreText,
      order: scoreValue,
      variant: isGoogol ? 'warning' : undefined,
      isUnique: true,
    },
  })
}
