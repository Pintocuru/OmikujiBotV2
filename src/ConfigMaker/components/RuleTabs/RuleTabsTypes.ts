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
 rules?: BaseRule[];
 selectRule?: (ruleId: string) => void;
 add?: () => void;
 update?: (ruleId: string, updates: Partial<BaseRule>) => void;
 duplicate?: (ruleId: string) => void;
 remove?: (ruleId: string) => void;
 reorder?: (fromIndex: number, toIndex: number) => void;
}

export interface FilterOptions {
 query: string;
 enabledOnly: boolean;
 searchInName: boolean;
 searchInDescription: boolean;
 colorFilter: string | null;
}
