// src/configMaker/components/RuleTabs/types.ts
export interface BaseRule {
 id: string;
 name: string;
 description?: string;
 order: number;
 editorColor?: string;
 isEnabled?: boolean;
}

export interface RuleStore {
 selectRule?: (ruleId: string) => void;
 add?: () => void;
 duplicate?: (ruleId: string) => void;
 reorder?: (fromIndex: number, toIndex: number) => void;
 remove?: (ruleId: string) => void;
 update?: (ruleId: string, updates: Partial<BaseRule>) => void;
}

export interface FilterOptions {
 query: string;
 enabledOnly: boolean;
 searchInName: boolean;
 searchInDescription: boolean;
 colorFilter: string | null;
}
