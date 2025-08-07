// src/MainGenerator/utils/commentProcessor/OmikujiProcessor.ts
// おみくじ処理クラス
import { BotMessage, RuleType, OmikujiDataType, OmikujiSetType, ScriptResult } from '@/types/';
import { Comment } from '@onecomme.com/onesdk/types/Comment';
import { GameScriptManager } from './GameScriptManager';
import { CommentContextManager } from './CommentContextManager';
import { PlaceProcess } from './PlaceProcess';
import { PostMessage } from '@/MainGenerator/script/PostMessage';
import { BotMessageGenerator } from './BotMessageGenerator';
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji';
import { ConsolePost } from '@shared/sdk/postMessage/ConsolePost';

export class OmikujiProcessor {
 private readonly placeProcess: PlaceProcess;
 private readonly postMessage: PostMessage;
 private readonly botMessageGenerator: BotMessageGenerator;
 private readonly contextManager = new CommentContextManager();

 constructor(
  private readonly omikujiData: OmikujiDataType,
  private readonly scriptManager?: GameScriptManager
 ) {
  this.placeProcess = new PlaceProcess(omikujiData.placeholders);
  this.postMessage = new PostMessage(omikujiData.characters);
  this.botMessageGenerator = new BotMessageGenerator(omikujiData.characters);
 }

 /**
  * おみくじの実行（コメント＋ルール指定）
  */
 executeOmikuji(comment: Comment, rule: RuleType): BotMessage[] {
  const omikujiItem = drawOmikuji(rule.omikuji);
  if (!omikujiItem) return [];

  return this.executeOmikujiProcess(comment, rule, omikujiItem);
 }

 /**
  * おみくじの実行（おみくじアイテムを直接指定）
  * scriptManagerが不要な場合に使用
  */
 executeOmikujiDirect(omikujiItem: OmikujiSetType, comment?: Comment): BotMessage[] {
  try {
   if (comment) {
    const defaultPlaceholders = this.contextManager.setupDefaultPlaceholdersComment(comment);
    this.placeProcess.updateResolvedValues(defaultPlaceholders);
   }

   return this.processOmikujiOnly(omikujiItem);
  } catch (error) {
   ConsolePost('error', `おみくじ直接実行エラー`, error);
   return [];
  }
 }

 /**
  * おみくじプロセスの実行
  */
 private executeOmikujiProcess(
  comment: Comment,
  rule: RuleType,
  omikujiItem: OmikujiSetType
 ): BotMessage[] {
  try {
   const defaultPlaceholders = this.contextManager.setupDefaultPlaceholdersComment(comment);
   this.placeProcess.updateResolvedValues(defaultPlaceholders);

   // scriptIdが存在し、scriptManagerが存在する場合のみスクリプトを実行
   const shouldExecuteScript = this.hasValidScript(rule) && this.scriptManager;

   if (shouldExecuteScript) {
    const scriptResult = this.scriptManager!.executeScript(comment, rule as any);
    return scriptResult
     ? this.processWithScript(scriptResult, omikujiItem)
     : this.processOmikujiOnly(omikujiItem);
   } else {
    return this.processOmikujiOnly(omikujiItem);
   }
  } catch (error) {
   ConsolePost('error', `おみくじプロセス実行エラー`, error);
   return [];
  }
 }

 /**
  * ルールが有効なスクリプトを持っているかチェック
  */
 private hasValidScript(rule: RuleType): boolean {
  // CommentRuleTypeの場合のみscriptIdをチェック
  if (rule.ruleType === 'comments') {
   return !!rule.scriptId;
  }
  // TimerRuleTypeの場合はscriptIdが存在しない
  return false;
 }

 /**
  * プレースホルダー処理（スクリプト結果付き）
  */
 private processWithScript(scriptResult: ScriptResult, omikujiItem: OmikujiSetType): BotMessage[] {
  try {
   // scriptのプレースホルダーをClassに追加
   this.placeProcess.updateResolvedValues(scriptResult.placeholders);
   // scriptのpostActionsを投稿する
   this.postMessage.post(scriptResult.postActions);

   // プレースホルダー処理
   const postActions = this.placeProcess.processPostActions(omikujiItem.postActions);
   // おみくじのpostActionsを投稿する
   this.postMessage.post(postActions);

   return this.botMessageGenerator.generateMessages(postActions);
  } finally {
   this.placeProcess.clearResolvedValues();
  }
 }

 /**
  * おみくじのみ処理（スクリプトなし）
  */
 private processOmikujiOnly(omikujiItem: OmikujiSetType): BotMessage[] {
  try {
   const postActions = this.placeProcess.processPostActions(omikujiItem.postActions);
   this.postMessage.post(postActions);

   return this.botMessageGenerator.generateMessages(postActions);
  } finally {
   this.placeProcess.clearResolvedValues();
  }
 }
}
