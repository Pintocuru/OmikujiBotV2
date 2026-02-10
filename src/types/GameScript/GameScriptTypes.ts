// shared/types/GameScriptTypes.ts
import { BotMessageRankingType, PostActionType } from '@/types/'
import { GameStateType } from '@game/scriptsEngine/LogRank/GameScriptSchema'
import { UserVisitManager } from '@/MainGenerator/stores/UserVisitManager/UserVisitManager'
import { PresetMetadata } from '@shared/types/'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

// スクリプトプリセット
export interface ScriptPreset extends PresetMetadata {
  execute: ScriptClass // メイン実行クラス
}

export type ScriptResult = {
  actions: PostActionType[]
  rankingMessages: BotMessageRankingType[]
}

// スクリプトのメイン実行クラス
export interface ScriptClass {
  run(queryString: string, characterKey: string, omiken?: OmikenCommentType): ScriptResult // メイン実行関数
  sampleRun?(queryString?: string): string // エディター用サンプルゲーム関数
  getGameState?(): GameStateType // ゲーム状態取得関数
}

// store のマネージャ呼び出し
export abstract class BaseScript {
  protected visitManager?: UserVisitManager

  // 初期化メソッド(GameScriptManagerから呼ばれる)
  initialize(visitManager?: UserVisitManager) {
    this.visitManager = visitManager
  }
}
