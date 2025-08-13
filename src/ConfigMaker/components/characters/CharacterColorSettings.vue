<!-- src/configMaker/components/characters/CharacterColorSettings.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t flex justify-between items-center">
   <span>カラー設定</span>
   <!-- ランダムボタン -->
   <div class="tooltip tooltip-bottom" data-tip="ランダムな色テーマに変更">
    <button @click="handleRandomColor" class="btn btn-ghost btn-sm">
     <Dices class="w-4 h-4" />
     カラーシャッフル
    </button>
   </div>
  </div>

  <div class="p-4 space-y-6">
   <!-- プレビュー -->
   <div class="relative flex justify-center">
    <div @click="handlePreviewClick" class="cursor-pointer">
     <CommentBubble
      name="テストユーザー"
      :comment="currentPreview"
      :color="localColor"
      text-size="md"
      :custom-classes="localColor.customClasses"
     />
    </div>
   </div>

   <!-- カラーピッカー -->
   <div class="flex flex-wrap gap-4">
    <div v-for="{ label, key } in colorFields" :key="key" class="form-control flex-1 min-w-32">
     <label class="label">
      <span class="label-text">{{ label }}</span>
     </label>
     <input type="color" class="input input-bordered h-12 w-full" v-model="localColor[key]" />
    </div>
   </div>

   <!-- カスタムクラス設定 -->
   <SettingItem
    label="カスタムTailwindクラス"
    description="グラデーション背景、ボーダー、影などを追加できます"
    @reset="localColor.customClasses = 'border-2 border-white'"
   >
    <input
     type="text"
     placeholder="例: bg-gradient-to-r from-blue-500 to-purple-600 border-2 border-white"
     class="input input-bordered w-full"
     v-model="localColor.customClasses"
    />
    <label class="label">
     <span class="label-text-alt"></span>
    </label>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { CharacterColorType } from '@/types/';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { DEFAULT_COLOR_THEMES } from '@/MainGenerator/scripts/BotCharacter/CharacterColorPreset';
import CommentBubble from '@MainComponents/OmikujiBot/CommentBubble.vue';
import { drawOmikuji } from '@omiken/shared/utils/omikuji/DrawOmikuji';
import { Dices } from 'lucide-vue-next';

const props = defineProps<{
 modelValue: CharacterColorType;
}>();

const emit = defineEmits<{
 'update:modelValue': [value: CharacterColorType];
}>();

// labelとキーを配列で管理
const colorFields = [
 { label: '名前の色', key: 'nameColor' },
 { label: 'テキストの色', key: 'textColor' },
 { label: '背景色', key: 'backgroundColor' }
] as const;

// プレビュー用のサンプルデータ配列
const previewDataList = [
 'これはプレビュー表示です。実際のコメント表示と同じスタイルで確認できます。',
 'カラー設定の確認をしています！文字の見やすさはいかがでしょうか？',
 '背景色と文字色のコントラストがしっかりと取れているか確認してくださいね。',
 'グラデーションやボーダーなど、カスタムクラスでさらにおしゃれにできます✨',
 'クリックするたびに違うメッセージが表示されるよ！試してみてね♪',
 'この吹き出しのデザインは本番環境と同じものです。安心してお使いください。'
];

// 現在表示中のプレビューデータ
const currentPreview = ref(previewDataList[0]);

// v-modelを使用したlocalColorの実装
const localColor = ref<CharacterColorType>({
 ...props.modelValue,
 customClasses: props.modelValue.customClasses || ''
});

// propsからlocalColorを更新
watch(
 () => props.modelValue,
 (newValue) => {
  // ここで全体を置き換えず、フィールドごとに更新
  for (const key in newValue) {
   (localColor.value as any)[key] = (newValue as any)[key];
  }
  if (!newValue.customClasses) {
   localColor.value.customClasses = '';
  }
 },
 { deep: true }
);

// localColorの変更を親に通知
watch(
 localColor,
 (newValue) => {
  emit('update:modelValue', newValue);
 },
 { deep: true }
);

// ランダムプレビューを取得する関数
const getRandomPreview = () => {
 return drawOmikuji(previewDataList) || previewDataList[0];
};

// プレビュークリック時の処理
const handlePreviewClick = () => {
 currentPreview.value = getRandomPreview();
};

// ランダム色設定の処理
const handleRandomColor = () => {
 const result = drawOmikuji(DEFAULT_COLOR_THEMES);
 if (result) {
  localColor.value = {
   ...result,
   customClasses: localColor.value.customClasses
  };
 }
 // カラーシャッフル時にプレビューも変更
 currentPreview.value = getRandomPreview();
};
</script>
