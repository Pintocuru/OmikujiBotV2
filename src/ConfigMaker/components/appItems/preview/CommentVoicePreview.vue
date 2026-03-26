<!-- src/ConfigMaker/components/appItems/preview/CommentVoicePreview.vue -->
<template>
  <div class="space-y-1.5 min-w-[180px] max-w-[240px]">
    <!-- ヘッダー -->
    <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70 pb-0.5 border-b border-base-300">
      <MessageSquare class="w-3 h-3" />
      <span>BOTコメント表現</span>
    </div>

    <!-- 表示モード -->
    <div class="flex items-center gap-1.5 text-xs">
      <Mic class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">モード:</span>
      <span class="badge badge-xs" :class="modeBadgeClass">
        {{ displayModeMap[option.mode ?? 'comment'] ?? option.mode }}
      </span>
    </div>

    <!-- RPG音声（rpgVoice モード時のみ） -->
    <div v-if="option.mode === 'rpgVoice'" class="flex items-center gap-1.5 text-xs">
      <Music class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">音声:</span>
      <span class="badge badge-xs badge-ghost font-mono">{{ option.rpgVoice }}</span>
    </div>

    <!-- わんコメ枠 -->
    <div v-if="option.frameId" class="flex items-center gap-1.5 text-xs">
      <LayoutTemplate class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">枠ID:</span>
      <span class="truncate font-mono opacity-80">{{ option.frameId }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { MessageSquare, Mic, Music, LayoutTemplate } from 'lucide-vue-next'
  import { DisplayOptionSchema, type CharacterType } from '@/types/OmikujiData/CharacterSchema'
  import { displayModeMap } from '@/types/MetaMaps/CharacterMaps'

  const props = defineProps<{
    data: Partial<CharacterType> | null
  }>()

  const option = computed(() => props.data?.displayOption ?? DisplayOptionSchema.parse({}))

  const modeBadgeClass = computed(() => {
    const map: Record<string, string> = {
      comment: 'badge-primary',
      voice: 'badge-secondary',
      rpgVoice: 'badge-accent',
      none: 'badge-ghost',
    }
    return map[option.value.mode ?? 'comment'] ?? 'badge-ghost'
  })
</script>
