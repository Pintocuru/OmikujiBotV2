// shared/types/GameScriptTypes.ts
import { PostActionType } from '../OmikujiData/OmikujiSchema'
import { GameStateType } from '@/common/GameScripts/scriptsEngine/LogRank/GameScriptSchema'
import { PresetMetadata } from '@shared/types/'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

// スクリプトプリセット
export interface ScriptPreset extends PresetMetadata {
  execute: ScriptClass // メイン実行クラス
}

// スクリプトのメイン実行クラス
export interface ScriptClass {
  run(queryString: string, characterKey: string, omiken?: OmikenCommentType): PostActionType[] // メイン実行関数
  sampleRun?(): string // エディター用サンプルゲーム関数
  getGameState?(): GameStateType // ゲーム状態取得関数
}
