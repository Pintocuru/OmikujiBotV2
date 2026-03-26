<!-- src/ConfigMaker/components/appItems/preview/LimitsPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-[180px] max-w-[240px]">
    <!-- ヘッダー -->
    <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70 pb-0.5 border-b border-base-300">
      <Timer class="w-3 h-3" />
      <span>制限設定</span>
    </div>

    <!-- クールダウン -->
    <div class="flex items-center gap-1.5 text-xs">
      <Clock class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">クールダウン:</span>
      <span v-if="limits.cooldownSeconds" class="badge badge-xs badge-warning"> {{ limits.cooldownSeconds }}秒 </span>
      <span v-else class="opacity-40">なし</span>
      <span v-if="limits.cooldownMessage" class="badge badge-xs badge-ghost">
        <MessageSquare class="w-2.5 h-2.5" />
      </span>
    </div>

    <!-- 連投制限 -->
    <div class="flex items-center gap-1.5 text-xs">
      <Repeat class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">連投:</span>
      <span class="badge badge-xs" :class="limits.isRepeatAllowed ? 'badge-success' : 'badge-error'">
        {{ limits.isRepeatAllowed ? '許可' : '制限あり' }}
      </span>
      <span v-if="!limits.isRepeatAllowed && limits.repeatMessage" class="badge badge-xs badge-ghost">
        <MessageSquare class="w-2.5 h-2.5" />
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Timer, Clock, Repeat, MessageSquare } from 'lucide-vue-next'
  import type { OmikujiLimitsType } from '@/types/OmikujiData/EventSchema'

  const props = defineProps<{
    data: { limits?: Partial<OmikujiLimitsType> } | null
  }>()

  const limits = computed(() => props.data?.limits ?? {})
</script>
