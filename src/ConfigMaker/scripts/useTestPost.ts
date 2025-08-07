// src/ConfigMaker/script/useTestPost.ts - テスト投稿用
import { computed } from 'vue';
import {
 OmikujiSetSchema,
 PostActionType,
 BotMessage,
 OmikujiSetType,
 CommentRuleType
} from '@/types/';
import { GameScriptManager } from '@MainScripts/omikujiProcess/GameScriptManager';
import { MockComment } from '@shared/__mocks__/CreateMockComment';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { useTimerRulesStore } from '@ConfigStores/useTimerRulesStore';
import { useCommentRulesStore } from '@ConfigStores/useCommentRulesStore';
import { drawOmikuji, addWeightPercentages } from '@shared/utils/omikuji/DrawOmikuji';
import { OmikujiProcessor } from '@MainScripts/omikujiProcess/OmikujiProcessor';
import { toast } from 'vue-sonner';

export function useTestPost() {
 const omikujiStore = useOmikujiStore();
 const commentRulesStore = useCommentRulesStore();
 const timerRulesStore = useTimerRulesStore();

 // 選択されているルールをコメントルールまたはタイマールールから取得するように変更
 const selectedRuleForProcessing = computed(() => {
  return commentRulesStore.selectedRule || timerRulesStore.selectedRule;
 });

 const toastTestPost = async (posts: BotMessage[]): Promise<void> => {
  try {
   await Promise.all(
    posts.map(
     (post) =>
      new Promise<void>((resolve) => {
       setTimeout(() => {
        resolve();
       }, post.delaySeconds * 1000);
      })
    )
   );
  } catch (error) {
   console.error('メッセージ投稿処理のトースト表示中にエラーが発生しました:', error);
   toast.error('テスト投稿の表示中にエラーが発生しました。');
  }
 };

 const postTestOmikujiItem = (actions: PostActionType[], drawnOmikuji?: OmikujiSetType) => {
  // selectedRuleForProcessing を使用して、どちらかのルールが存在するかチェック
  if (!selectedRuleForProcessing.value) {
   toast.error('テスト投稿の対象となるルールが選択されていません。'); // ユーザーにフィードバックを追加
   return;
  }

  const scriptManager = new GameScriptManager(omikujiStore.data);
  const userCommentProcessor = new OmikujiProcessor(omikujiStore.data, scriptManager);

  const botMessageArray = userCommentProcessor.executeOmikujiProcess(
   MockComment('suika'),
   selectedRuleForProcessing.value,
   OmikujiSetSchema.parse({ postActions: actions })
  );

  // 抽選結果の詳細情報をトーストで表示（15秒間）
  if (drawnOmikuji) {
   const weight = drawnOmikuji.weight || 1;
   // ! drawOmikuji で新たなプロパティが付与されてるのでany
   const weightPercent = (drawnOmikuji as any).weightPercent || 0;
   const omikujiName = drawnOmikuji.name || 'おみくじ';

   // アクションの内容を取得（最初のメッセージアクションを表示）
   const firstMessageAction = actions.find((action) => action.messageContent);
   const messageContent = firstMessageAction?.messageContent || 'メッセージなし';

   toast.success('おみくじ抽選結果', {
    description: `
おみくじ: ${omikujiName}
内容: ${messageContent}
重み: ${weight}
確率: ${weightPercent.toFixed(2)}%
     `.trim(),
    duration: 15000, // 15秒間表示
    style: {
     maxWidth: '400px',
     whiteSpace: 'pre-line'
    }
   });
  }

  toastTestPost(botMessageArray);
 };

 const postTestOmikuji = (omikujis: OmikujiSetType[]) => {
  // weightPercentを付与したomikujisを作成
  const omikujisWithPercent = addWeightPercentages(omikujis);

  const omikujiItem = drawOmikuji(omikujisWithPercent);
  if (!omikujiItem) {
   toast.error('おみくじ抽選結果', {
    description: '該当するおみくじがありませんでした。',
    duration: 5000
   });
   return;
  }

  // 抽選されたおみくじの情報も一緒に渡す
  postTestOmikujiItem(omikujiItem.postActions, omikujiItem);
 };

 return {
  postTestOmikuji,
  postTestOmikujiItem,
  toastTestPost
 };
}
