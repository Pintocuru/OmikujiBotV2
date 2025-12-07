// shared/types/GameScriptTypes.ts
// 250726_1 PresetMetadata に合わせて編集
import { GameState } from './GameScriptSchema'
import { PostActionWordPartyType } from '../OmikujiData/OmikujiSchema'
import { DefaultTypes, PresetMetadata } from '@shared/types/'
import { Comment } from '@onecomme.com/onesdk/'

// スクリプトプリセット
export interface ScriptPreset extends PresetMetadata {
  execute: ScriptClass // メイン実行クラス
}

// スクリプトのメイン実行クラス
export interface ScriptClass<TSettings extends object = DefaultTypes> {
  setup(settings: TSettings, ruleId?: string): void // 初期化処理
  run(comment: Comment, charaId: string, params: string): ScriptResult // メイン実行関数
  sampleRun?(): string // エディター用サンプルゲーム関数
  getGameState(): GameState | null // gameState取得
  cleanup?(gameState: GameState): void // 終了処理（オプション）
}

// スクリプト実行の結果
export interface ScriptResult {
  postActions: PostActionWordPartyType[] // わんコメに投稿するWordParty
}

// ===== パラメータ関連 =====

// パラメータの入力タイプ
export type ParameterInputType = 'select' | 'number' | 'string' | 'boolean'

// パラメータアイテム
export type ParameterItem<T extends object = DefaultTypes, K extends keyof T = keyof T> = {
  key: K
  name: string // 名前
  description: string // 説明
  inputType: ParameterInputType
  defaultValue: T[K]
  values?: ReadonlyArray<T[K]>
  min?: number
  max?: number
}

// プレースホルダーアイテム
export interface ScriptPlaceholderItem<T extends object = DefaultTypes> {
  key: Extract<keyof T, string> // プレースホルダーID
  name: string // 名前
  description: string // 説明
  value: string | number // プレースホルダーの値
}
