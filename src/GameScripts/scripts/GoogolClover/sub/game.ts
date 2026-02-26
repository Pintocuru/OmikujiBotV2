// src/GameScripts/scripts/GoogolClover/sub/game.ts
import type { UserState } from './types'
import { executeSlotSpins } from './slotExecution'
import { buildGameResult } from './resultBuilder'
import { UserNameType } from '@shared/types'
import { BotMessageExtraType } from '@/types'

/**
 * ゲーム結果の完全な型定義
 */
export interface GameExecutionResult {
  bubble: string
  botMessageExtra: BotMessageExtraType
  shouldDeleteState: boolean
  newState: UserState | null
}

/**
 * スロットゲームのメイン処理
 *
 * @param userStates - ユーザー状態のマップ
 * @param context - ユーザー情報
 * @param rankingKey - ランキングキー
 * @returns ゲーム実行結果(bubble、ランキングデータ、状態更新指示)
 */
export function executeGame(userStates: Map<string, UserState>, context: UserNameType): GameExecutionResult {
  // 現在の状態を取得(初回は初期値)
  const currentState = userStates.get(context.userId) ?? {
    funds: 1.0,
    exp: 0,
    successCount: 0,
    isGoogol: false,
  }

  // スロット実行
  const executionResult = executeSlotSpins(currentState)

  // 結果の構築
  const gameResult = buildGameResult(executionResult, context)

  // 状態の更新
  if (gameResult.shouldDeleteState) {
    userStates.delete(context.userId)
  } else if (gameResult.newState) {
    userStates.set(context.userId, gameResult.newState)
  }

  return gameResult
}
