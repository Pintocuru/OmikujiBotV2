<!-- src/MainGenerator/ui/KujibikiPanel/layouts/faceCutout.vue -->
<template>
  <div class="relative flex items-center justify-center">
    <!-- フレーム画像 -->
    <img v-if="imagePath" :src="imagePath" class="max-w-full h-auto block" alt="frame" />

    <!-- 中央アイコン（存在する時だけ中央揃え） -->
    <img
      v-if="icon"
      :src="icon"
      :style="{ width: iconSize + 'px', height: iconSize + 'px' }"
      :class="[
        'rounded-full object-cover',
        imagePath ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : '',
      ]"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageBubbleType, getImagePath } from '@/types'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'

  const props = defineProps<{
    messages: BotMessageBubbleType[]
    label: string
    imagePath?: string
    iconSize?: number
  }>()

  const current = computed(() => props.messages[0])

  // アイコン画像
  const icon = computed(() => current.value?.origin?.profileImage ?? getAvatarUrl(current.value?.origin?.userName))

  // アイコンサイズ（デフォルト128）
  const iconSize = computed(() => props.iconSize ?? 128)

  // フレーム画像
  const imagePath = computed(() => getImagePath(props.imagePath))
</script>
