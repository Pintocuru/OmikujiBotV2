// src/stores/types.ts
import { BotMessage, OmikujiDataType } from '@/types/';
import { GameScriptManager } from '@/MainGenerator/scripts/omikujiProcess/GameScriptManager';
import { CharacterCollector } from '@/MainGenerator/scripts/omikujiProcess/CharacterCollector';
import { ConfigUserType } from '@shared/types';

export interface AppState {
 isInitialized: boolean;
 omikujiData: OmikujiDataType | null;
 config: ConfigUserType;
}

export interface MessageState {
 botMessages: BotMessage[];
 scriptManager: GameScriptManager | null;
 characterCollector: CharacterCollector | null;
}

export interface DisplayState {
 displaySize: string;
 currentModeIndex: number;
 currentScriptKey: string | null;
 availableScriptKeys: string[];
 updateTrigger: number;
 selectedComponent: string | null;
}
