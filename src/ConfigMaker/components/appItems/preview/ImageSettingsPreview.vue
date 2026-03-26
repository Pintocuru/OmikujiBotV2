<!-- src/ConfigMaker/components/appItems/preview/ImageSettingsPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-[180px] max-w-[240px]">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between pb-0.5 border-b border-base-300">
      <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70">
        <ImageIcon class="w-3 h-3" />
        <span>画像設定</span>
      </div>
      <span class="badge badge-xs" :class="totalLayers > 0 ? 'badge-success' : 'badge-ghost'">
        {{ totalLayers }}レイヤー
      </span>
    </div>

    <div v-if="totalLayers === 0" class="text-xs opacity-40">画像未設定</div>

    <!-- 感情ごとにレイヤー数を表示（設定あるもののみ） -->
    <div v-for="(count, emotion) in settedEmotions" :key="emotion" class="flex items-center gap-1.5 text-xs">
      <Layers class="w-3 h-3 shrink-0 opacity-60" />
      <span class="flex-1 opacity-80">{{ emotionLabel(emotion) }}</span>
      <span class="badge badge-xs badge-ghost">×{{ count }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Image as ImageIcon, Layers } from 'lucide-vue-next'
  import type { CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import { characterEmotionMap } from '@/types/MetaMaps/CharacterMaps'

  const props = defineProps<{
    data: Partial<CharacterType> | null
  }>()

  const image = computed(() => props.data?.image ?? {})

  // レイヤーがあるemotionのみ抽出: { emotion: layerCount }
  const settedEmotions = computed(() => {
    const result: Record<string, number> = {}
    for (const [key, layers] of Object.entries(image.value)) {
      if (Array.isArray(layers) && layers.length > 0) {
        result[key] = layers.length
      }
    }
    return result
  })

  const totalLayers = computed(() => Object.values(settedEmotions.value).reduce((sum, n) => sum + n, 0))

  function emotionLabel(key: string) {
    return characterEmotionMap[key as keyof typeof characterEmotionMap] ?? key
  }
</script>
