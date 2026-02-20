// src/types/GameScript/GameScriptTypes.ts
import { PostFlowType } from '../OmikujiData'
import { BotMessageExtraType } from '../MainGenerator'
import { GameStateType } from './GameStateSchema'
import { PresetMetadata } from '@shared/types/'
import { OmikenCommentType } from '@shared/types/OmikenComment/OmikenCommentSchema'

// スクリプトプリセット
export interface ScriptPreset extends PresetMetadata {
  execute: ScriptClass // メイン実行クラス
}

// ran実行時の返り値
export type ScriptResult = {
  actions: PostFlowType[]
  botMessageExtras: BotMessageExtraType[]
}

// スクリプトのメイン実行クラス
export interface ScriptClass {
  run(queryString: string, characterKey: string | null, omiken?: OmikenCommentType): ScriptResult // メイン実行関数
  sampleRun?(queryString?: string): string // エディター用サンプルゲーム関数
  getGameState?(): GameStateType // ゲーム状態取得関数
}
