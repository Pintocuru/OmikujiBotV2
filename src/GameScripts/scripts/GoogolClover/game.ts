// src/GameScripts/GoogolClover/game.ts
import type { UserState } from './sub/types'
import { executeSlotSpins } from './sub/slotExecution'
import { buildGameResult } from './sub/resultBuilder'

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
 * スロットゲームのメイン処理
 */
export function playSlot(userStates: Map<string, UserState>, context: GameContext) {
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

  return gameResult
}
