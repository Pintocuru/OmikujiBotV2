// src/GameScripts/GoogolClover/game.ts
import { PostActionMessageBodySchema, PostActionMessageBodyType } from '@/types/'
import { GOAL_EXPONENT, MIN_SPINS, MAX_SPINS, CURRENCY_SYMBOL } from './constants'
import type { UserState, SlotResult } from './types'
import { formatShort, spinSlot, formatScoreText, calculateScoreValue } from './utils'
import { UserNameSchema, UserNameType } from '@shared/types/OmikenComment/OmikenCommentSchema'

/**
 * ゲーム実行に必要なコンテキスト情報
 */
export interface GameContext {
  userId: string
  userName: string
  profileImage: string
  rankingKey: string
}

/**
 * スロット実行結果
 */
interface SlotExecutionResult {
  spins: number
  totalMultiplier: number
  failedAt: number
  multipliers: number[]
  state: UserState
}

/**
 * ゲーム結果（状態更新指示を含む）
 */
interface GameResult {
  message: PostActionMessageBodyType
  shouldDeleteState: boolean
  newState: UserState | null
}

/**
 * スロットゲームのメイン処理
 */
export function playSlot(userStates: Map<string, UserState>, context: GameContext): PostActionMessageBodyType {
  const currentState = userStates.get(context.userId) ?? {
    funds: 1.0,
    exp: 0,
    successCount: 0,
    isGoogol: false,
  }

  const executionResult = executeSlotSpins(currentState)
  const gameResult = buildGameResult(executionResult, context)

  // 状態の更新
  if (gameResult.shouldDeleteState) {
    userStates.delete(context.userId)
  } else if (gameResult.newState) {
    userStates.set(context.userId, gameResult.newState)
  }

  return gameResult.message
}

/**
 * スロット抽選の実行（純粋関数）
 */
function executeSlotSpins(initialState: UserState): SlotExecutionResult {
  const spins = Math.floor(Math.random() * (MAX_SPINS - MIN_SPINS + 1)) + MIN_SPINS
  let totalMultiplier = 1.0
  let failedAt = -1
  const multipliers: number[] = []
  let state = { ...initialState }

  for (let i = 0; i < spins; i++) {
    const result = spinSlot(state.successCount)

    if (!result.isSuccess) {
      failedAt = i + 1
      multipliers.push(0)
      break
    }

    const currentMultiplier = 1 + result.multiplier
    totalMultiplier *= currentMultiplier
    multipliers.push(Math.round(result.multiplier))
  }

  // 全て成功した場合のみ成功回数を増やす
  if (failedAt < 0) {
    state = { ...state, successCount: state.successCount + 1 }
  }

  return { spins, totalMultiplier, failedAt, multipliers, state }
}

/**
 * ゲーム結果の生成（純粋関数）
 */
function buildGameResult(result: SlotExecutionResult, context: GameContext): GameResult {
  const { failedAt, multipliers, totalMultiplier } = result
  const multipliersDisplay = multipliers.map((m) => `${m}`).join('×')

  const user = UserNameSchema.parse({
    name: context.userName,
    userId: context.userId,
    profileImage: context.profileImage,
  })

  // 失敗時
  if (failedAt > 0) {
    return {
      message: createFailureMessage(
        context.userName,
        multipliersDisplay,
        context.rankingKey,
        user,
        result.state.successCount
      ),
      shouldDeleteState: true,
      newState: null,
    }
  }

  // 成功時：資金を更新
  const updatedState = normalizeState({
    ...result.state,
    funds: result.state.funds * totalMultiplier,
  })

  // 目標達成チェック
  if (updatedState.exp >= GOAL_EXPONENT) {
    return {
      message: createGoalAchievedMessage(updatedState, context.userName, multipliersDisplay, context.rankingKey, user),
      shouldDeleteState: false,
      newState: updatedState,
    }
  }

  // 通常の成功
  return {
    message: createSuccessMessage(
      updatedState,
      context.userName,
      multipliersDisplay,
      totalMultiplier,
      context.rankingKey,
      user
    ),
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
 * 失敗メッセージの生成
 */
function createFailureMessage(
  userName: string,
  multipliersDisplay: string,
  rankingKey: string,
  user: UserNameType,
  successCount: number
): PostActionMessageBodyType {
  return PostActionMessageBodySchema.parse({
    user,
    bubble: `${userName}はサイコロを振る! ${multipliersDisplay}!${userName}は奈落へと消えた。`,
    ranking: {
      scriptKey: rankingKey,
      listName: userName,
      symbol: `${successCount}回目`,
      scoreText: '0',
      scoreValue: 0,
      isUniqueUser: true,
    },
  })
}

/**
 * 目標達成メッセージの生成
 */
function createGoalAchievedMessage(
  state: UserState,
  userName: string,
  multipliersDisplay: string,
  rankingKey: string,
  user: UserNameType
): PostActionMessageBodyType {
  const finalDisplay = formatShort(state.funds, state.exp)
  const exitVoice = !state.isGoogol ? '出口への扉が開いた。' : ''
  const scoreText = formatScoreText(state.funds, state.exp)
  const scoreValue = calculateScoreValue(state.funds, state.exp) * 1000000

  return PostActionMessageBodySchema.parse({
    user,
    bubble: `${userName}はサイコロを振る! ${multipliersDisplay}!${finalDisplay}${CURRENCY_SYMBOL}獲得!${exitVoice}`,
    ranking: {
      scriptKey: rankingKey,
      listName: userName,
      symbol: `${state.successCount}回目`,
      scoreText,
      scoreValue,
      isUniqueUser: true,
    },
  })
}

/**
 * 通常成功メッセージの生成
 */
function createSuccessMessage(
  state: UserState,
  userName: string,
  multipliersDisplay: string,
  totalMultiplier: number,
  rankingKey: string,
  user: any
): PostActionMessageBodyType {
  const currentDisplay = formatShort(state.funds, state.exp)
  const scoreText = formatScoreText(state.funds, state.exp)
  const scoreValue = calculateScoreValue(state.funds, state.exp) * 1000000

  return PostActionMessageBodySchema.parse({
    user,
    bubble: `${userName}はサイコロを振る! ${multipliersDisplay}!${currentDisplay}${CURRENCY_SYMBOL}獲得!`,
    ranking: {
      scriptKey: rankingKey,
      listName: userName,
      symbol: `${state.successCount}回目`,
      scoreText,
      scoreValue,
      isUniqueUser: true,
    },
  })
}
