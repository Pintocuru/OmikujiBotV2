// src/configMaker/components/parts/types/idEditor.ts
import { RecordCategoryType } from '@/types/';

export type CharacterUsage = {
 comments: string[];
 timers: string[];
};

export type UpdateResult = {
 success: boolean;
 error?: string;
};

export interface IdUpdateStrategy<T extends RecordCategoryType> {
 updateId(oldId: string, newId: string): boolean;
 updateReferences?(oldId: string, newId: string): void;
}

export const CATEGORY_TITLES: Record<RecordCategoryType, string> = {
 comments: 'コメントルール',
 timers: 'タイマールール',
 characters: 'キャラクター',
 placeholders: 'プレースホルダー'
} as const;

export const ITEM_TYPE_LABELS: Record<RecordCategoryType, string> = {
 characters: 'キャラクター',
 placeholders: 'プレースホルダー',
 comments: 'コメントルール',
 timers: 'タイマールール'
} as const;
