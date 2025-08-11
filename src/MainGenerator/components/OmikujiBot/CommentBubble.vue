<!-- src/components/common/CommentBubble.vue -->
<template>
 <div class="w-full max-w-3xl p-4 rounded-xl relative" :class="customClasses" :style="bubbleStyles">
  <!-- 名前表示 -->
  <div
   v-if="name && name !== ''"
   class="mb-0"
   :class="textSizeClass"
   :style="{ color: color?.nameColor || '#ccc' }"
  >
   {{ name }}
  </div>

  <!-- コメント内容 -->
  <div class="break-words" :class="textSizeClass" :style="{ color: color?.textColor || '#ccc' }">
   {{ comment }}
  </div>

  <!-- 吹き出しの矢印 -->
  <div
   v-if="showArrow"
   class="absolute w-0 h-0 -bottom-5 left-1/2 -translate-x-1/2 transform"
   :style="arrowStyles"
  />
 </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { CharacterColorType } from '@/types/';
import { DisplaySize } from '@shared/types';

interface Props {
 name?: string;
 comment: string;
 color?: CharacterColorType;
 textSize?: DisplaySize;
 brightness?: number;
 showArrow?: boolean;
 customClasses?: string;
}

const props = withDefaults(defineProps<Props>(), {
 name: '',
 comment: '',
 textSize: 'md',
 brightness: 100,
 showArrow: true,
 customClasses: ''
});

// テキストサイズのクラス定義
const TEXT_SIZE_CLASSES = {
 xs: 'text-md',
 sm: 'text-lg',
 md: 'text-xl',
 lg: 'text-2xl',
 xl: 'text-3xl'
} as const;

const textSizeClass = computed(() => TEXT_SIZE_CLASSES[props.textSize]);

// 吹き出しのスタイル
const bubbleStyles = computed(() => {
 const baseStyles: Record<string, string> = {};

 // カスタムクラスが指定されていない場合のみ、色とフィルターを適用
 if (!props.customClasses) {
  baseStyles.backgroundColor = props.color?.backgroundColor || '#212121';
  baseStyles.filter = `brightness(${props.brightness}%)`;
 }

 return baseStyles;
});

// 矢印のスタイル
const arrowStyles = computed(() => ({
 borderLeft: '20px solid transparent',
 borderRight: '20px solid transparent',
 borderTop: `20px solid ${props.color?.backgroundColor || '#212121'}`,
 filter: `brightness(${props.brightness}%)`
}));
</script>
