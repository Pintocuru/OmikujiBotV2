// src/MainGenerator/utils/commentProcessor/PostActionProcessor.ts
// ポストアクション処理クラス
// =====================================
import { BotMessage, CharacterType, OmikujiSetType, PostActionType, ScriptResult } from '@/types/';
import { PlaceProcess } from './PlaceProcess';
import { PostMessage } from '@/MainGenerator/script/PostMessage';
import { BotMessageGenerator } from './BotMessageGenerator';

export class PostActionProcessor {
 private readonly postMessage: PostMessage;
 private readonly botMessageGenerator: BotMessageGenerator;

 constructor(
  characters: Record<string, CharacterType>,
  private readonly placeProcess: PlaceProcess
 ) {
  this.postMessage = new PostMessage(characters);
  this.botMessageGenerator = new BotMessageGenerator(characters);
 }

 /**
  * プレースホルダー処理（スクリプト結果付き）
  */
 processWithScript(scriptResult: ScriptResult, omikujiItem: OmikujiSetType): BotMessage[] {
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
 processOmikujiOnly(omikujiItem: OmikujiSetType, isDuplicateComment: boolean): BotMessage[] {
  try {
   const postActions = this.placeProcess.processPostActions(omikujiItem.postActions);

   if (isDuplicateComment) {
    const modifiedPostActions = this.sanitizeForDuplicate(postActions);
    this.postMessage.post(modifiedPostActions);
   } else {
    this.postMessage.post(postActions);
   }

   return this.botMessageGenerator.generateMessages(postActions);
  } finally {
   this.placeProcess.clearResolvedValues();
  }
 }

 /**
  * コメント重複時のPostAction調整
  * 重複コメントの場合、メッセージ内容をトーストに移動し、コンテンツとwordPartyをクリア
  */
 private sanitizeForDuplicate(postActions: PostActionType[]): PostActionType[] {
  return postActions.map((action) => ({
   ...action,
   wordParty: '',
   messageToast: action.messageContent,
   messageContent: ''
  }));
 }
}
