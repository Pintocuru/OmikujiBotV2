import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { OmikujiData, PostAction, PostActionWordParty } from './OmikujiTypes';
export interface BasePresetItem {
    id: string;
    name: string;
    description: string;
}
export interface PresetMetadata extends BasePresetItem {
    version: string;
    author?: string;
    order?: number;
    tags: string[];
    url?: string;
    banner?: string;
    path?: string;
}
export type DefaultSettings = Record<string, any>;
export type DefaultParams = Record<string, any>;
export type DefaultPlaceholders = Record<string, string>;
export type DefaultGameExtras = Record<string, any>;
export interface OmikujiPreset extends PresetMetadata {
    item: OmikujiData;
    isOverwrite?: boolean;
}
export interface CharacterPreset extends PresetMetadata {
    isIconDisplay: boolean;
    displayName?: string;
    frameId: string | null;
    color: CharacterColorScheme;
    image: CharacterImageSet;
}
export interface CharacterColorScheme {
    nameColor: string;
    textColor: string;
    backgroundColor: string;
}
export interface CharacterImageSet {
    Default: string;
    [emotionState: string]: string;
}
export interface ScriptPreset<TSettings extends DefaultSettings = DefaultSettings, TParams extends DefaultParams = DefaultParams, TPlaceholders extends DefaultPlaceholders = DefaultPlaceholders, TGameExtras extends DefaultGameExtras = DefaultGameExtras> extends PresetMetadata {
    execute: ScriptClass<TSettings, TParams, TPlaceholders, TGameExtras>;
    settings: ParameterItem<TSettings>[];
    params: ParameterItem<TParams>[];
    placeholders: ScriptPlaceholderItem<TPlaceholders>[];
    apiConfig?: ApiConfig;
}
export interface ApiConfig {
    baseURL: string;
    timeout?: number;
    defaultHeaders?: Record<string, string>;
    retryCount?: number;
}
export interface ScriptClass<TSettings extends DefaultSettings = DefaultSettings, TParams extends DefaultParams = DefaultParams, TPlaceholders extends DefaultPlaceholders = DefaultPlaceholders, TGameExtras extends DefaultGameExtras = DefaultGameExtras> {
    setup(settings: TSettings): Promise<void> | void;
    run(comment: Comment, params: TParams): ScriptResult<TPlaceholders>;
    apiCall?(gameState: GameState<TGameExtras>, method: HttpMethod, endpoint: string, body?: any, headers?: Record<string, string>): Promise<ApiCallResult<TGameExtras>>;
    cleanup?(gameState: GameState<TGameExtras>): Promise<void> | void;
}
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface ScriptResult<TPlaceholders extends DefaultPlaceholders = DefaultPlaceholders> {
    postActions: PostAction[] | PostActionWordParty[];
    placeholders: TPlaceholders;
}
export interface ApiCallResult<TGameExtras extends DefaultGameExtras = DefaultGameExtras> {
    status: 'success' | 'error';
    statusCode?: number;
    gameState: GameState<TGameExtras>;
    message: string;
    data?: any;
    error?: {
        code: string;
        details?: any;
    };
}
export type ParameterInputType = 'select' | 'number' | 'string' | 'boolean';
export interface ParameterItem<T extends Record<string, any> = Record<string, any>> extends BasePresetItem {
    id: Extract<keyof T, string>;
    inputType: ParameterInputType;
    defaultValue: T[Extract<keyof T, string>];
    values?: readonly T[Extract<keyof T, string>][];
    min?: number;
    max?: number;
}
export interface ScriptPlaceholderItem<T extends DefaultPlaceholders = DefaultPlaceholders> extends BasePresetItem {
    id: Extract<keyof T, string>;
    value: string;
}
export type GameState<TExtras extends DefaultGameExtras = DefaultGameExtras> = {
    ruleId: string;
    totalDraws: number;
    userStats: Record<string, UserStatistics>;
    currentUserIds: string[];
} & TExtras;
export interface UserStatistics {
    userId: string;
    name?: string;
    draws: number;
    wins?: number;
    points?: number;
    status?: string;
    lastPlayed?: string;
}
export type SimpleScriptPreset = ScriptPreset<{}, {}, {}, {}>;
export type ConfigurableScriptPreset<TSettings extends DefaultSettings = DefaultSettings, TGameExtras extends DefaultGameExtras = DefaultGameExtras> = ScriptPreset<TSettings, {}, {}, TGameExtras>;
export type FullScriptPreset<TSettings extends DefaultSettings = DefaultSettings, TParams extends DefaultParams = DefaultParams, TPlaceholders extends DefaultPlaceholders = DefaultPlaceholders, TGameExtras extends DefaultGameExtras = DefaultGameExtras> = ScriptPreset<TSettings, TParams, TPlaceholders, TGameExtras>;
export type AnyPreset = OmikujiPreset | CharacterPreset | ScriptPreset<any, any, any, any>;
//# sourceMappingURL=PresetTypes.d.ts.map