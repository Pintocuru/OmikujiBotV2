// shared/types/GameScriptTypes.ts
// 250726_1 PresetMetadata に合わせて編集
import { GameState } from './GameScriptSchema';
import { PostActionType, PostActionWordPartyType } from '../OmikujiBot/OmikujiSchema';
import { GameComponentConfig } from '../GameComponent/GameRankingTypes';
import { DefaultTypes, PresetMetadata } from '@shared/types/';
import { Comment } from '@onecomme.com/onesdk/types/Comment';

// スクリプトプリセット
export interface ScriptPreset<
 TSettings extends object = DefaultTypes,
 TParams extends object = DefaultTypes,
 TPlaceholders extends object = DefaultTypes
> extends PresetMetadata {
 execute: ScriptClass<TSettings, TParams, TPlaceholders>; // メイン実行クラス
 settings: ParameterItem<TSettings>[]; // スクリプトの設定値
 params: ParameterItem<TParams>[]; // 実行時にユーザーが入力するパラメータ
 placeholders: ScriptPlaceholderItem<TPlaceholders>[]; // 動的置換用プレースホルダー
 componentConfig: GameComponentConfig | null; // コンポーネント設定
}

// ===== スクリプト実行クラス =====

// スクリプトのメイン実行クラス
export interface ScriptClass<
 TSettings extends object = DefaultTypes,
 TParams extends object = DefaultTypes,
 TPlaceholders extends object = DefaultTypes
> {
 setup(settings: TSettings, ruleId?: string): void; // 初期化処理
 run(comment: Comment, params: TParams): ScriptResult<TPlaceholders>; // メイン実行関数
 getGameState(): GameState | null; // gameState取得
 cleanup?(gameState: GameState): void; // 終了処理（オプション）
}

// スクリプト実行の結果
export interface ScriptResult<TPlaceholders extends object = DefaultTypes> {
 postActions: (PostActionType | PostActionWordPartyType)[]; // わんコメに投稿するコメント・WordParty
 placeholders: TPlaceholders; // runして出力されたプレースホルダー群
}

// ===== パラメータ関連 =====

// パラメータの入力タイプ
export type ParameterInputType = 'select' | 'number' | 'string' | 'boolean';

// パラメータアイテム
export type ParameterItem<T extends object = DefaultTypes, K extends keyof T = keyof T> = {
 key: K;
 name: string; // 名前
 description: string; // 説明
 inputType: ParameterInputType;
 defaultValue: T[K];
 values?: ReadonlyArray<T[K]>;
 min?: number;
 max?: number;
};

// プレースホルダーアイテム
export interface ScriptPlaceholderItem<T extends object = DefaultTypes> {
 key: Extract<keyof T, string>; // プレースホルダーID
 name: string; // 名前
 description: string; // 説明
 value: string | number; // プレースホルダーの値
}
