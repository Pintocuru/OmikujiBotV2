import { ScriptPlaceholderItem, ParameterItem } from '@public/types/PresetTypes';
export interface GameSettings {
    isParty: 'ON' | 'OFF';
}
export declare const settings: ParameterItem<GameSettings>[];
export type GameParams = {
    isRank: 'ON' | 'OFF';
};
export declare const params: ParameterItem<GameParams>[];
export type GamePlaceholder = {
    message: string;
    symbol: string;
    payout: string;
    winsRank: string;
};
export declare const placeholders: ScriptPlaceholderItem<GamePlaceholder>[];
export interface GameResult {
    symbolIdx: number;
    symbol: string;
    name: string;
    ways: number[];
    payout: number;
    hasBoost: boolean;
}
//# sourceMappingURL=params.d.ts.map