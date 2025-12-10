// shared/types/GameScriptTypes.ts
// 250726_1 PresetMetadata に合わせて編集
import { GameState } from './GameScriptSchema'
import { PostActionType, PostActionWordPartyType } from '../OmikujiData/OmikujiSchema'
import { DefaultTypes, PresetMetadata } from '@shared/types/'
import { Comment } from '@onecomme.com/onesdk/'

// スクリプトプリセット
export interface ScriptPreset extends PresetMetadata {
  execute: ScriptClass // メイン実行クラス
}

// スクリプトのメイン実行クラス
export interface ScriptClass<TSettings extends object = DefaultTypes> {
  setup(settings: TSettings, ruleId?: string): void // 初期化処理
  run(params: string, characterKey: string, comment?: Comment): ScriptResult // メイン実行関数
  sampleRun?(): string // エディター用サンプルゲーム関数
}

// スクリプト実行の結果
export interface ScriptResult {
  postActions: PostActionType[] // わんコメに投稿するWordParty
}
