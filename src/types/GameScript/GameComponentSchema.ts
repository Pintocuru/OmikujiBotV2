// shared/types/GameComponentSchema.ts
import { DefaultTypes, DisplaySize } from '../../../../../shared/types/CommonSchema';
import { UserStatsType } from './GameScriptSchema';
import { RankComponentConfig } from './GameScriptTypes';

/**
 * shared であるもの
 */

/**
 * shared ではないもの
 */

// props型定義付き
export type ScriptComponentPropsType<T extends object = DefaultTypes> = {
 componentConfig: RankComponentConfig | null;
 settings: T;
 userRankings: UserStatsType[];
 displaySize: DisplaySize;
};
