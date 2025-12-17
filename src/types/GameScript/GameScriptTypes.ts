// shared/types/GameScriptTypes.ts
// 250726_1 PresetMetadata に合わせて編集
import { PostActionType } from '../OmikujiData/OmikujiSchema'
import { DefaultTypes, PresetMetadata } from '@shared/types/'
import { Comment } from '@onecomme.com/onesdk/'

// スクリプトプリセット
export interface ScriptPreset extends PresetMetadata {
  execute: ScriptClass // メイン実行クラス
}

// スクリプトのメイン実行クラス
export interface ScriptClass<TSettings extends object = DefaultTypes> {
  run(params: string, characterKey: string, comment?: Comment): PostActionType[] // メイン実行関数
  sampleRun?(): string // エディター用サンプルゲーム関数
}
