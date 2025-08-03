// src/MainGenerator/utils/commentProcessor/OmikujiProcessor.ts
// おみくじ処理クラス
import { BotMessage, CommentRuleType, OmikujiDataType, OmikujiSetType } from '@type/';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { GameScriptManager } from './GameScriptManager';
import { CommentContextManager } from './CommentContextManager';
import { PlaceProcess } from './PlaceProcess';
import { PostActionProcessor } from './PostActionProcessor';
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji';
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost';

export class OmikujiProcessor {
 private readonly placeProcess: PlaceProcess;
 private readonly postActionProcessor: PostActionProcessor;
 private readonly contextManager = new CommentContextManager();

 constructor(
  omikujiData: OmikujiDataType,
  private readonly scriptManager: GameScriptManager
 ) {
  this.placeProcess = new PlaceProcess(omikujiData.placeholders);
  this.postActionProcessor = new PostActionProcessor(omikujiData.characters, this.placeProcess);
 }

 /**
  * おみくじの実行
  */
 executeOmikuji(
  comment: Comment,
  rule: CommentRuleType,
  isDuplicateComment: boolean
 ): BotMessage[] {
  const omikujiItem = drawOmikuji(rule.omikuji);
  if (!omikujiItem) return [];

  return this.executeOmikujiProcess(comment, rule, omikujiItem, isDuplicateComment);
 }

 /**
  * おみくじプロセスの実行
  */
 executeOmikujiProcess(
  comment: Comment,
  rule: CommentRuleType,
  omikujiItem: OmikujiSetType,
  isDuplicateComment: boolean = false
 ): BotMessage[] {
  try {
   const defaultPlaceholders = this.contextManager.setupDefaultPlaceholdersComment(comment);
   this.placeProcess.updateResolvedValues(defaultPlaceholders);

   const scriptResult = this.scriptManager.executeScript(comment, rule);

   return scriptResult
    ? this.postActionProcessor.processWithScript(scriptResult, omikujiItem)
    : this.postActionProcessor.processOmikujiOnly(omikujiItem, isDuplicateComment);
  } catch (error) {
   ConsolePost('error', `おみくじプロセス実行エラー`, error);
   return [];
  }
 }
}
