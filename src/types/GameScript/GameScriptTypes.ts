// shared/types/GameScriptTypes.ts
import { PostActionType } from '../OmikujiData/OmikujiSchema'
import { GameStateType } from '@/common/GameScripts/scriptsEngine/LogRank/GameScriptSchema'
import { PresetMetadata } from '@shared/types/'
import { Comment } from '@onecomme.com/onesdk/'

// スクリプトプリセット
export interface ScriptPreset extends PresetMetadata {
  execute: ScriptClass // メイン実行クラス
}

// スクリプトのメイン実行クラス
export interface ScriptClass {
  run(queryString: string, characterKey: string, comment?: Comment): PostActionType[] // メイン実行関数
  sampleRun?(): string // エディター用サンプルゲーム関数
  getGameState(): GameStateType | null // ゲーム状態取得関数
}
