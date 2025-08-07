<!-- src/configMaker/components/placeholders/PlaceholderPreview.vue -->
<template>
 <!-- おみくじテストボタン -->
 <div class="tooltip tooltip-bottom" data-tip="わんコメを起動すると、投稿の確認ができます">
  <button @click="handleDraw" class="btn btn-ghost btn-sm" :disabled="!values.length">
   <Dices class="w-4 h-4" />
   抽選テスト
  </button>
 </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { PlaceholderValueType, PostActionSchema, PostActionType } from '@/types/';
import { usePlaceholderStore } from '@ConfigStores/usePlaceholderStore';
import { drawOmikuji, addWeightPercentages } from '@shared/utils/omikuji/DrawOmikuji';
import { PlaceProcess } from '@MainScripts/omikujiProcess/PlaceProcess';
import { postSpeech } from '@shared/sdk/postMessage/PostOneComme';
import { toast } from 'vue-sonner';
import { Dices } from 'lucide-vue-next';

const props = defineProps<{
 id: string;
 values: PlaceholderValueType[];
}>();

// ストアを使用
const placeholderStore = usePlaceholderStore();
const placeholdersMap = computed(() => placeholderStore.rulesMap);

const totalWeight = computed(() => props.values.reduce((sum, v) => sum + (v.weight || 0), 0));

const percentage = (weight: number) => {
 if (totalWeight.value === 0) return 0;
 return Math.round((weight / totalWeight.value) * 100);
};

// 抽選結果
const drawnValue = ref<PlaceholderValueType | null>(null);
// PlaceProcess2による処理結果
const processedContent = ref<string>('');
// デバッグ情報
const debugInfo = ref<Record<string, string | number>>({});

const handleDraw = () => {
 // weightPercentを付与したvaluesを作成
 const valuesWithPercent = addWeightPercentages(props.values);

 // 従来の抽選処理
 drawnValue.value = drawOmikuji(valuesWithPercent);

 if (drawnValue.value?.content) {
  // PlaceProcess2を使用してプレースホルダー置換をテスト
  const placeProcess = new PlaceProcess(placeholdersMap.value);

  // テスト用のダミーおみくじデータを作成
  const testPost: PostActionType = PostActionSchema.parse({
   messageContent: drawnValue.value.content
  });
  // プレースホルダー置換処理を実行
  const processedActions = placeProcess.processPostActions([testPost]);

  // 結果を取得
  processedContent.value = processedActions[0]?.messageContent || '';

  // デバッグ情報を取得
  debugInfo.value = placeProcess.getResolvedValues();

  // トーストで結果を表示（15秒間）
  const weight = drawnValue.value.weight || 1;
  // ! drawOmikuji で新たなプロパティが付与されてるのでany
  const weightPercent = (drawnValue.value as any).weightPercent || 0;

  toast.success('抽選結果', {
   description: `
内容: ${processedContent.value}
重み: ${weight}
確率: ${weightPercent.toFixed(2)}%
    `.trim(),
   duration: 15000, // 15秒間表示
   style: {
    maxWidth: '400px',
    whiteSpace: 'pre-line'
   }
  });
 } else {
  processedContent.value = '';
  debugInfo.value = {};

  // 抽選結果がない場合のトースト
  toast.error('抽選結果', {
   description: '抽選できませんでした',
   duration: 5000
  });
 }

 // 結果をわんコメのスピーチ機能で喋らせる
 if (processedContent.value) {
  postSpeech(processedContent.value);
 }
};
</script>
