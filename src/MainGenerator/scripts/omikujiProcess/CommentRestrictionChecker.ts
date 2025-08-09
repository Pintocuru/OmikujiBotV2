// src/MainGenerator/utils/commentProcessor/CommentRestrictionChecker.ts
// 制限チェッカー
import { BotMessage, BotMessageSchema, CharacterType, CommentRuleType } from '@/types/';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { CooldownManager } from './CooldownManager';

interface RestrictionCheckResult {
 isBlocked: boolean;
 toastMessages: BotMessage[];
}

export class CommentRestrictionChecker {
 constructor(
  private readonly cooldownManager: CooldownManager,
  private readonly firstCharacter: CharacterType
 ) {}

 /**
  * 制限チェック（重複チェック、クールダウンチェック）
  */
 checkRestrictions(comment: Comment, rule: CommentRuleType): RestrictionCheckResult {
  const isCommentBased = rule.threshold.conditions.includes('comment');
  const userName = comment.data.displayName || comment.data.name;

  // クールダウンチェック
  if (this.isCooldownBlocked(rule)) {
   return {
    isBlocked: true,
    toastMessages: this.createErrorToast(
     `コメントが被って、「${rule.name}」ができなかったよ。またコメントしてね。`
    )
   };
  }

  // 重複チェック（コメントベースのルールのみ）
  if (isCommentBased && this.isRepeatBlocked(comment, rule)) {
   return {
    isBlocked: true,
    toastMessages: this.createErrorToast(
     `${userName}さんは、連投制限で「${rule.name}」ができなかったよ。`
    )
   };
  }

  // 回数制限
  if (isCommentBased && this.isDrawLimitExceeded(comment, rule)) {
   return {
    isBlocked: true,
    toastMessages: this.createErrorToast(
     `${userName}さんの「${rule.name}」は上限の${rule.limits.drawLimit}回を超えているよ。`
    )
   };
  }

  return { isBlocked: false, toastMessages: [] };
 }

 // 連投制限
 private isRepeatBlocked(comment: Comment, rule: CommentRuleType): boolean {
  return this.cooldownManager.isRepeatBlocked(comment.data.userId, rule.limits.isRepeatAllowed);
 }

 // クールダウン制限
 private isCooldownBlocked(rule: CommentRuleType): boolean {
  const processCooldownSeconds = rule.limits.processCooldownSeconds;
  return this.cooldownManager.isCooldownBlocked(processCooldownSeconds);
 }

 // 回数制限
 private isDrawLimitExceeded(comment: Comment, rule: CommentRuleType): boolean {
  return this.cooldownManager.isDrawLimitExceeded(
   comment.data.userId,
   rule.id,
   rule.limits.drawLimit
  );
 }

 /**
  * エラー用のトーストメッセージを作成
  */
 private createErrorToast(message: string): BotMessage[] {
  return [
   BotMessageSchema.parse({
    name: this.firstCharacter.name,
    profileImage: this.firstCharacter.image.default,
    comment: message,
    isToast: true,
    color: this.firstCharacter.color
   })
  ];
 }
}
