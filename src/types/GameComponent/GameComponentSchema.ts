// shared/types/GameComponentSchema.ts
import { DefaultTypes, DisplaySize } from '@shared/types/';
import { UserStatsType } from '../GameScript/GameScriptSchema';
import { GameComponentConfig } from './GameRankingTypes';

export interface GameStatistics {
 averageScore: number;
 totalScore: number;
 totalCount: number;
}

// props型定義付き
export type ScriptComponentPropsType = {
 componentConfig: GameComponentConfig | null;
 settings: DefaultTypes;
 userRankings: UserStatsType[];
 displaySize: DisplaySize;
};
