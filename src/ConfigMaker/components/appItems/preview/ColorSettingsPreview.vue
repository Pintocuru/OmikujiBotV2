<!-- src/ConfigMaker/components/appItems/preview/ColorSettingsPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-[180px] max-w-[240px]">
    <!-- ヘッダー -->
    <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70 pb-0.5 border-b border-base-300">
      <Palette class="w-3 h-3" />
      <span>フキダシカラー</span>
    </div>

    <!-- DaisyUI テーマ使用 -->
    <div class="flex items-center gap-1.5 text-xs">
      <Brush class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">モード:</span>
      <span class="badge badge-xs" :class="color.isTheme ? 'badge-primary' : 'badge-ghost'">
        {{ color.isTheme ? 'DaisyUI テーマ' : 'カスタム' }}
      </span>
    </div>

    <!-- DaisyUI テーマ時 -->
    <template v-if="color.isTheme">
      <div class="flex items-center gap-1.5 text-xs">
        <span class="opacity-70 ml-4">テーマ:</span>
        <span class="badge badge-xs badge-outline">{{ color.daisyUiTheme ?? '—' }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-xs">
        <span class="opacity-70 ml-4">グラデ:</span>
        <span class="badge badge-xs" :class="`badge-${color.backFrom ?? 'primary'}`">
          {{ color.backFrom ?? '—' }}
        </span>
        <span class="opacity-40">→</span>
        <span class="badge badge-xs" :class="`badge-${color.backTo ?? 'secondary'}`">
          {{ color.backTo ?? '—' }}
        </span>
      </div>
    </template>

    <!-- カスタム時 -->
    <template v-else>
      <div class="flex items-center gap-1.5 text-xs">
        <span class="opacity-70 ml-4">背景:</span>
        <span
          class="w-4 h-4 rounded border border-base-300 shrink-0"
          :style="{ backgroundColor: color.backgroundColor }"
        />
        <span class="font-mono opacity-70">{{ color.backgroundColor }}</span>
      </div>
      <div class="flex items-center gap-1.5 text-xs">
        <span class="opacity-70 ml-4">テキスト:</span>
        <span class="w-4 h-4 rounded border border-base-300 shrink-0" :style="{ backgroundColor: color.textColor }" />
        <span class="font-mono opacity-70">{{ color.textColor }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Palette, Brush } from 'lucide-vue-next'
  import { CharacterColorScheme, type CharacterType } from '@/types/OmikujiData/CharacterSchema'

  const props = defineProps<{
    data: CharacterType | null
  }>()

  const color = computed(() => props.data?.color ?? CharacterColorScheme.parse({}))
</script>
