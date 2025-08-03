import { CommentThreshold } from './OmikujiThresholdTypes';
export type OmikujiData = {
    comments: Record<string, CommentRule>;
    timers: Record<string, TimerRule>;
    placeholders: Record<string, PlaceholderSource>;
};
export declare const RULE_CATEGORIES: readonly ["comments", "timers"];
export type RuleCategory = (typeof RULE_CATEGORIES)[number];
type BaseRule = {
    id: string;
    name: string;
    description: string;
    isEnabled: boolean;
    order: number;
    editorColor: string;
    scriptId: string | null;
    scriptSettings: Record<string, any> | null;
};
export type CommentRule = BaseRule & {
    ruleType: 'comments';
    threshold: CommentThreshold;
    omikuji: OmikujiSet[];
};
export type TimerRule = BaseRule & {
    ruleType: 'timers';
    intervalSeconds: number;
    omikuji: OmikujiSet[];
};
export type RuleTypeMap = {
    comments: CommentRule;
    timers: TimerRule;
};
export type OmikujiSet<TParams extends Record<string, any> = Record<string, any>> = {
    name: string;
    description: string;
    weight: number;
    scriptParams: TParams;
    placeholderIds: string[];
    postActions: PostAction[];
};
export type PostAction = {
    iconKey: string;
    delaySeconds: number;
    wordParty: string;
    messageContent: string;
    messageToast: string;
};
export type PostActionWordParty = Pick<PostAction, 'delaySeconds' | 'wordParty'>;
export type PlaceholderSource = {
    id: string;
    name: string;
    description: string;
    placeholderIds: string[];
    values: PlaceholderSourceValue[];
};
export type PlaceholderSourceValue = {
    weight: number;
    content: string;
};
export type Placeholder = {
    id: string;
    value: string;
};
export type OmikujiCategory = RuleCategory | 'placeholders';
export type CategoryDataMap = {
    comments: CommentRule;
    timers: TimerRule;
    placeholders: PlaceholderSource;
};
export type GetCategoryData<T extends OmikujiCategory> = CategoryDataMap[T];
export declare function isCommentRule(rule: BaseRule): rule is CommentRule;
export declare function isTimerRule(rule: BaseRule): rule is TimerRule;
export {};
//# sourceMappingURL=OmikujiTypes.d.ts.map