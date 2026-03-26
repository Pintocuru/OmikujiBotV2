<!-- src/MainGenerator/ui/StreamCounter/layouts/LabelText.vue -->
<template>
  <!-- アイコン -->
  <component :is="label" v-if="isComponent" class="w-8 h-8" />

  <!-- ラベル（string のとき） -->
  <div v-else :class="[isEmoji ? 'text-3xl emoji-wiggle' : 'text-xl font-bold truncate']">
    {{ label }}
  </div>
</template>

<script setup lang="ts">
  import { type Component, computed } from 'vue'

  const props = defineProps<{
    label: string | Component
  }>()

  const isComponent = computed(() => typeof props.label !== 'string')

  // 絵文字判定（ZWJ シーケンス含む）
  const emojiRegex = /\p{Extended_Pictographic}/u

  const isEmoji = computed(() => {
    return typeof props.label === 'string' && emojiRegex.test(props.label)
  })
</script>

<style scoped>
  /* ゆらゆらアニメーション（控えめ・かわいい） */
  @keyframes wiggle {
    0% {
      transform: rotate(0deg) translateY(0);
    }
    25% {
      transform: rotate(5deg) translateY(-5px);
    }
    50% {
      transform: rotate(0deg) translateY(0);
    }
    75% {
      transform: rotate(-5deg) translateY(-5px);
    }
    100% {
      transform: rotate(0deg) translateY(0);
    }
  }

  .emoji-wiggle {
    display: inline-block;
    animation: wiggle 5s ease-in-out infinite;
  }
</style>
