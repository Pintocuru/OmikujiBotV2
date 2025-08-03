export interface CommentThreshold {
    conditions: CommentConditionType[];
    syoken: SyokenConditionArray;
    access: AccessConditionArray;
    gift: GiftConditionArray;
    count: CountCondition;
    comment: string[];
}
export declare const CommentConditionTypes: {
    readonly SYOKEN: "syoken";
    readonly ACCESS: "access";
    readonly GIFT: "gift";
    readonly COUNT: "count";
    readonly COMMENT: "comment";
};
export type CommentConditionType = (typeof CommentConditionTypes)[keyof typeof CommentConditionTypes];
export declare const SyokenCondition: {
    readonly SYOKEN: 1;
    readonly AGAIN: 2;
    readonly HI: 3;
};
export type SyokenCondition = (typeof SyokenCondition)[keyof typeof SyokenCondition];
export type SyokenConditionArray = SyokenCondition[];
export declare const AccessCondition: {
    readonly GUEST: 1;
    readonly MEMBER: 2;
    readonly MODERATOR: 3;
    readonly ADMIN: 4;
};
export type AccessCondition = (typeof AccessCondition)[keyof typeof AccessCondition];
export type AccessConditionArray = AccessCondition[];
export declare const GiftCondition: {
    readonly All: 0;
    readonly Blue: 1;
    readonly LightBlue: 2;
    readonly Green: 3;
    readonly Yellow: 4;
    readonly Orange: 5;
    readonly Pink: 6;
    readonly Red: 7;
    readonly Purple: 8;
};
export type GiftCondition = (typeof GiftCondition)[keyof typeof GiftCondition];
export type GiftConditionArray = GiftCondition[];
export interface CountCondition {
    comparison: 'min' | 'max' | 'equal' | 'loop';
    unit: 'lc' | 'tc';
    value: number;
}
type ComparisonType = 'min' | 'max' | 'equal' | 'loop';
export interface MatchCondition {
    target: 'comment' | 'name' | 'displayName';
    value: string[];
}
export interface TimerThreshold {
    conditionType: TimerConditionType;
    isNot?: boolean;
}
export type TimerConditionType = 'draws';
export interface MetaThreshold {
    conditionType: MetaConditionType;
    isNot?: boolean;
    metaCount?: MetaCountCondition;
    dynamic?: MetaDynamicCondition;
}
export type MetaConditionType = 'draws' | 'metaCount' | 'dynamic';
export interface MetaCountCondition {
    comparison: ComparisonType;
    unit: 'streamDuration' | 'totalGifts' | 'followers';
    value: number;
}
export interface MetaDynamicCondition {
    comparison: 'min' | 'max' | 'different' | 'increasing' | 'newMaximum';
    unit: 'upVote' | 'viewer';
    value: number;
}
export {};
//# sourceMappingURL=OmikujiThresholdTypes.d.ts.map