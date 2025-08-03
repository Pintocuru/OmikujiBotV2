import { GameState, UserStatistics, ScriptPlaceholderItem, ParameterItem } from '@public/types/PresetTypes';
export type GameStatePlus = GameState<{
    rankings: UserRankingType[];
}>;
export type GameStateExtras = {
    rankings: UserRankingType[];
};
export interface UserRankingType extends Partial<UserStatistics> {
    userId: string;
    name: string;
    rank?: number;
    rate?: number;
}
export interface GameSettings {
    rankMode: 'wins' | 'rate' | 'point' | 'totalPoints';
}
export declare const settings: ParameterItem<GameSettings>[];
export type GameParams = {
    isWin: 'OFF' | 'ON';
    getPoint: number;
    isRank: 'ON' | 'OFF';
};
export declare const params: ParameterItem<GameParams>[];
export type GamePlaceholder = {
    winsCount: string;
    winsRank: string;
    winsRate: string;
};
export declare const placeholders: ScriptPlaceholderItem<GamePlaceholder>[];
//# sourceMappingURL=params.d.ts.map