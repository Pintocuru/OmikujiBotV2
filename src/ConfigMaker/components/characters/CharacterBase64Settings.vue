<!-- src/configMaker/components/characters/CharacterImageSettings.vue -->
<template>
 <div class="card bg-base-300 mt-4">
  <div class="card-title bg-secondary text-lg p-2 pl-4 rounded-t">わんコメ表示用画像設定</div>

  <div class="card-body p-4">
   <!-- サイズ設定エリア(未使用) -->
   <SettingItem
    v-if="false"
    label="画像サイズ"
    description="リサイズ後の画像サイズを選択してください"
    :showReset="false"
    containerClass="form-control flex-row items-center gap-2 mt-2"
   >
    <select v-model="imageSize" class="select select-bordered select-primary">
     <option value="16">16×16</option>
     <option value="24">24×24</option>
     <option value="32">32×32</option>
    </select>
   </SettingItem>

   <!-- Base64画像設定エリア -->
   <SettingItem
    label="わんコメ表示用画像"
    :description="`${imageSize}×${imageSize}にリサイズし、Base64として保存されます`"
    :showReset="false"
    containerClass="form-control flex-row items-center gap-2 mt-2"
   >
    <div class="flex flex-col sm:flex-row gap-4 items-start">
     <input
      ref="fileInput"
      type="file"
      class="file-input file-input-bordered file-input-primary w-full"
      accept="image/*"
      @change="handleImageSelect"
     />
     <div class="pr-4">
      <div v-if="localImages" class="relative">
       <img
        :src="localImages"
        alt="Base64画像プレビュー"
        :class="`w-${Math.max(16, imageSize)} h-${Math.max(16, imageSize)} rounded border-2 border-primary bg-white object-cover`"
       />
       <button
        class="btn btn-xs btn-circle btn-error absolute -top-1 -right-1"
        @click="resetBase64Image"
        title="Base64画像をリセット"
       >
        <X class="w-3 h-3" />
       </button>
      </div>
      <div
       v-else
       :class="`w-${Math.max(16, imageSize)} h-${Math.max(16, imageSize)} rounded border-2 border-dashed border-base-300 flex items-center justify-center bg-base-200`"
      >
       <ImageIcon class="w-6 h-6 text-base-content/30" />
      </div>
     </div>
    </div>
   </SettingItem>
  </div>
 </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import SettingItem from '@ConfigComponents/parts/SettingItem.vue';
import { X, ImageIcon } from 'lucide-vue-next';

const props = defineProps<{
 modelValue?: string;
 id: string;
 backgroundColor: string;
}>();

const emit = defineEmits<{
 'update:modelValue': [value?: string];
}>();

// 画像サイズの設定（デフォルト16）
const imageSize = ref<number>(24);

// ファイル入力の参照
const fileInput = ref<HTMLInputElement>();

// v-modelを使用したlocalImagesの実装（型エラー修正）
const localImages = computed({
 get: () => props.modelValue || '',
 set: (value?: string) => {
  emit('update:modelValue', value);
 }
});

// Base64画像のリセット
const resetBase64Image = () => {
 localImages.value = undefined;
 if (fileInput.value) fileInput.value.value = '';
};

// 画像ファイル選択時の処理
const handleImageSelect = (event: Event) => {
 const target = event.target as HTMLInputElement;
 const file = target.files?.[0];
 if (file) resizeImageToBase64(file);
};

// 画像を指定サイズにリサイズしてBase64に変換
const resizeImageToBase64 = (file: File) => {
 const reader = new FileReader();

 reader.onload = (e) => {
  const img = new Image();
  img.onload = () => {
   const canvas = document.createElement('canvas');
   const ctx = canvas.getContext('2d');

   if (!ctx) return;

   const size = imageSize.value;
   canvas.width = size;
   canvas.height = size;

   // 白背景を描画（透明部分対策）
   ctx.fillStyle = props.backgroundColor || '#ccc';
   ctx.fillRect(0, 0, size, size);

   // 画像を指定サイズにリサイズして描画
   ctx.drawImage(img, 0, 0, size, size);

   // Base64データを取得
   const base64Data = canvas.toDataURL('image/png');
   localImages.value = base64Data;
  };

  img.src = e.target?.result as string;
 };

 reader.readAsDataURL(file);
};
</script>
