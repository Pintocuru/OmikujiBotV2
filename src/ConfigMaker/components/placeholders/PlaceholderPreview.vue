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
import { PlaceProcess } from '@MainScripts/omikujiProcess/PlaceProcess';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { drawOmikuji, addWeightPercentages } from '@omiken/shared/utils/omikuji/DrawOmikuji';
import { postSpeech } from '@omiken/shared/sdk/postMessage/PostOneComme';
import { toast } from 'vue-sonner';
import { Dices } from 'lucide-vue-next';

const props = defineProps<{
 id: string;
 values: PlaceholderValueType[];
}>();

// ストアを使用
const omikujiStore = useOmikujiStore();
const placeholdersMap = computed(() => omikujiStore.getCategoryMap('placeholders'));

// 抽選結果
const drawnValue = ref<PlaceholderValueType | null>(null);
// PlaceProcess2による処理結果
const processedContent = ref<string>('');
// デバッグ情報
const debugInfo = ref<Record<string, string | number>>({});

const handleDraw = () => {
 // 抽選
 const valuesWithPercent = addWeightPercentages(props.values);
 drawnValue.value = drawOmikuji(valuesWithPercent);

 if (drawnValue.value?.content) {
  // プレースホルダー置換
  const placeProcess = new PlaceProcess(placeholdersMap.value);
  const testPost: PostActionType = PostActionSchema.parse({
   messageContent: drawnValue.value.content
  });
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
  // 結果をわんコメのスピーチ機能で喋らせる
  postSpeech(processedContent.value);
 } else {
  processedContent.value = '';
  debugInfo.value = {};

  // 抽選結果がない場合のトースト
  toast.error('抽選結果', {
   description: '抽選できませんでした',
   duration: 5000
  });
 }
};
</script>
