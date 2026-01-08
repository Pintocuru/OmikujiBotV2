// src/GameScripts/GoogolClover/resultBuilder.ts
import { GOAL_EXPONENT } from './constants'
import type { UserState } from './types'
import type { GameContext } from '../game'
import type { SlotExecutionResult } from './slotExecution'
import { normalizeState } from './stateNormalizer'
import { createFailureMessage, createGoalAchievedMessage, createSuccessMessage } from './messageFactory'

/**
 * ゲーム結果（状態更新指示を含む）
 */
export interface GameResult {
  botMessage: ReturnType<typeof createSuccessMessage | typeof createFailureMessage | typeof createGoalAchievedMessage>
  shouldDeleteState: boolean
  newState: UserState | null
}

/**
 * ゲーム結果の生成（純粋関数）
 */
export function buildGameResult(result: SlotExecutionResult, context: GameContext): GameResult {
  const { failedAt, multipliers } = result
  const multipliersDisplay = multipliers.map((m) => `${m}`).join('×')

  // 失敗時
  if (failedAt > 0) {
    return {
      botMessage: createFailureMessage(
        context.userName,
        multipliersDisplay,
        context.rankingKey,
        context,
        result.state.successCount
      ),
      shouldDeleteState: true,
      newState: null,
    }
  }

  // 成功時：資金を更新
  const updatedState = normalizeState({
    ...result.state,
    funds: result.state.funds * result.totalMultiplier,
  })

  // 目標達成チェック
  if (updatedState.exp >= GOAL_EXPONENT) {
    return {
      botMessage: createGoalAchievedMessage(
        updatedState,
        context.userName,
        multipliersDisplay,
        context.rankingKey,
        context
      ),
      shouldDeleteState: false,
      newState: updatedState,
    }
  }

  // 通常の成功
  return {
    botMessage: createSuccessMessage(
      updatedState,
      context.userName,
      multipliersDisplay,
      result.totalMultiplier,
      context.rankingKey,
      context
    ),
    shouldDeleteState: false,
    newState: updatedState,
  }
}
