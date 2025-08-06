// src/configMaker/components/RuleTabs/types.ts
import { BaseTypes } from '@shared/types';

export interface RuleStore {
 rules?: BaseTypes[];
 selectRule?: (ruleId: string) => void;
 add?: () => void;
 update?: (ruleId: string, updates: Partial<BaseTypes>) => void;
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
