// src/types/GameScript.ts
import { Comment } from '@onecomme.com/onesdk/'
import { PostActionWordPartyType, GameState } from '@/types/'
import { GameSettings, GameParams, GamePlaceholder } from './params'

/**
 * GameScript インターフェース
 * ゲーム固有のスクリプト実装用（ジェネリック不使用）
 */
export interface GameScript {
  /**
   * スクリプトを初期化する
   */
  setup(settings: GameSettings, ruleId: string): void

  /**
   * ゲームを実行する
   */
  run(comment: Comment, params: GameParams): GameScriptResult

  /**
   * ゲーム状態を取得する
   */
  getGameState(): GameState

  /**
   * サンプル実行結果を取得する（エディター用）
   */
  sampleRun(): GamePlaceholder
}

/**
 * GameScriptの実行結果
 */
export interface GameScriptResult {
  postActions: PostActionWordPartyType[]
}
