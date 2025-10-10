// src/GameContext.ts
// ゲーム実行に必要な全ての情報を一つにまとめたコンテキスト
import { GameState } from '@/types/'
import { GameParams, GameSettings } from './params'

export interface GameContext {
  settings: GameSettings
  params: GameParams
  gameState: GameState
  currentUser: {
    userId: string
    name: string
  }
}
