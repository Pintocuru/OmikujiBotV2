// src/MainGenerator/omikujiProcess/UserCommentProcessor.ts
import { BotMessage, CommentRuleType, OmikujiDataType } from '@type/';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { GameScriptManager } from './GameScriptManager';
import { CommentRestrictionChecker } from './CommentRestrictionChecker';
import { OmikujiProcessor } from './OmikujiProcessor';
import { CooldownManager } from './CooldownManager';
import { checkAllConditions } from '@shared/utils/threshold/ThresholdChecker';

interface RuleProcessResult {
 shouldSkip: boolean;
 botMessages: BotMessage[];
 isDuplicateComment: boolean;
}

export class UserCommentProcessor {
 private readonly cooldownManager = new CooldownManager();
 private readonly restrictionChecker: CommentRestrictionChecker;
 private readonly omikujiProcessor: OmikujiProcessor;

 constructor(
  private readonly omikujiData: OmikujiDataType,
  scriptManager: GameScriptManager
 ) {
  const firstCharacter = Object.values(omikujiData.characters)[0];
  this.restrictionChecker = new CommentRestrictionChecker(this.cooldownManager, firstCharacter);

  this.omikujiProcessor = new OmikujiProcessor(omikujiData, scriptManager);
 }

 /**
  * ユーザーコメントの処理
  */
 generateBotMessages(comment: Comment): BotMessage[] {
  try {
   const botMessages: BotMessage[] = [];
   let isDuplicateComment = false;

   const sortedRules = this.getSortedEnabledRules();

   for (const rule of sortedRules) {
    // ルールチェック
    const result = this.runRuleExecution(comment, rule, isDuplicateComment);

    botMessages.push(...result.botMessages);
    isDuplicateComment = result.isDuplicateComment;

    if (result.shouldSkip) continue;

    // コメントルールが処理された場合、クールダウンタイムを更新
    if (rule.threshold.conditions.includes('comment')) {
     this.cooldownManager.updateLastProcessedTime();
    }
   }

   return botMessages;
  } catch (error) {
   console.error('ユーザーコメント処理エラー:', error);
   return [];
  }
 }

 /**
  * ルールチェック
  */
 private runRuleExecution(
  comment: Comment,
  rule: CommentRuleType,
  isDuplicateComment: boolean
 ): RuleProcessResult {
  // 1. Thresholdチェック
  const validationResult = this.validateThreshold(comment, rule, isDuplicateComment);

  if (!validationResult) {
   return {
    shouldSkip: true,
    botMessages: [],
    isDuplicateComment
   };
  }

  // 2. 制限チェック
  const restrictionResult = this.restrictionChecker.checkRestrictions(comment, rule);

  if (restrictionResult.isBlocked) {
   return {
    shouldSkip: true,
    botMessages: restrictionResult.toastMessages,
    isDuplicateComment: true
   };
  }

  // 3. おみくじ実行
  const omikujiMessages = this.omikujiProcessor.executeOmikuji(comment, rule, isDuplicateComment);

  // 4. ユーザー情報の更新
  this.cooldownManager.updateUserId(comment.data.userId, rule.id);

  return {
   shouldSkip: false,
   botMessages: omikujiMessages,
   isDuplicateComment: true
  };
 }

 /**
  * ルールの並び替え
  */
 private getSortedEnabledRules(): CommentRuleType[] {
  return Object.values(this.omikujiData.comments)
   .filter((rule) => rule.isEnabled)
   .sort((a, b) => a.order - b.order);
 }

 /**
  * コメントルールの条件チェック
  */
 private validateThreshold(
  comment: Comment,
  rule: CommentRuleType,
  isDuplicateComment: boolean
 ): boolean {
  const isCommentBased = rule.threshold.conditions.includes('comment');
  // 重複コメントで、かつコメント条件を含む場合はスキップ
  if (isDuplicateComment && isCommentBased) return false;

  // コメント条件チェック
  return checkAllConditions(comment, rule.threshold);
 }
}
