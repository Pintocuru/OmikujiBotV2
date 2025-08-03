// shared/types/GameComponentSchema.ts
import { DefaultTypes, DisplaySize } from '@shared/types/';
import { UserStatsType } from './GameScriptSchema';

// コンポーネント表示設定
export interface RankComponentConfig {
 rankingTitle: string; // ランキング表のタイトル名
 themeName: string; // テーマ名
 useRankingBackgrounds?: boolean; // 1-3位の表記にするか
}

// props型定義付き
export type ScriptComponentPropsType<T extends object = DefaultTypes> = {
 componentConfig: RankComponentConfig | null;
 settings: T;
 userRankings: UserStatsType[];
 displaySize: DisplaySize;
};
