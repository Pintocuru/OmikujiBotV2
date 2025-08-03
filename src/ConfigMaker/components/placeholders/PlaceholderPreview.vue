<!-- src/configMaker/components/placeholders/PlaceholderPreview.vue -->
<template>
 <div class="card bg-base-300 mt-4" v-if="values.length > 0">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">プレースホルダープレビュー</div>
  <div class="card-body space-y-3">
   <!-- 抽選結果の表示 -->
   <div v-if="drawnValue" class="card card-body bg-base-200">
    <div class="text-sm font-medium">抽選結果:</div>
    <div class="text-lg font-semibold">
     {{ processedContent }}
    </div>
    <div class="text-sm text-gray-500 mt-1">
     重み: {{ drawnValue.weight }}
     <span v-if="totalWeight > 0"> ({{ percentage(drawnValue.weight) }}%)</span>
    </div>
   </div>

   <!-- デバッグ情報 -->
   <div
    v-if="debugInfo && Object.keys(debugInfo).length > 0"
    class="card card-body bg-info text-info-content"
   >
    <div class="text-info-content font-medium">解決済みプレースホルダー情報:</div>
    <div class="text-sm">
     <div v-for="(value, key) in debugInfo" :key="key" class="mt-1">
      <span class=""><<{{ key }}>> </span>: {{ value }}
     </div>
    </div>
   </div>
   <!-- 抽選ボタン -->
   <button class="btn btn-primary btn-sm" @click="handleDraw">
    抽選する(わんコメが起動していれば、喋ってくれます)
   </button>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { PlaceholderValueType, PostActionSchema, PostActionType } from '@/types/';
import { usePlaceholderStore } from '@ConfigStore/usePlaceholderStore';
import { drawOmikuji } from '@shared/utils/omikuji/DrawOmikuji';
import { PlaceProcess } from '@/MainGenerator/omikujiProcess/PlaceProcess';
import { postSpeech } from '@shared/sdk/postMessage/PostOneComme';

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
 // 従来の抽選処理
 drawnValue.value = drawOmikuji(props.values);

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
 } else {
  processedContent.value = '';
  debugInfo.value = {};
 }
 // 結果をわんコメのスピーチ機能で喋らせる
 postSpeech(processedContent.value);
};
</script>
