<!-- src/ConfigMaker/components/appItems/preview/TriggerPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-[180px] max-w-[240px]">
    <!-- ヘッダー -->
    <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70 pb-0.5 border-b border-base-300">
      <Filter class="w-3 h-3" />
      <span>発動条件</span>
    </div>

    <!-- metas モード -->
    <template v-if="mode === 'metas' && serviceTrigger">
      <div class="flex items-center gap-1.5 text-xs">
        <Activity class="w-3 h-3 shrink-0 opacity-60" />
        <span class="opacity-70">条件:</span>
        <span class="badge badge-xs badge-primary">{{ serviceTrigger.condition }}</span>
      </div>
      <div v-if="serviceTrigger.elapsedMinutes != null" class="flex items-center gap-1.5 text-xs">
        <Clock class="w-3 h-3 shrink-0 opacity-60" />
        <span class="opacity-70">経過:</span>
        <span class="font-mono">{{ serviceTrigger.elapsedMinutes }}分</span>
      </div>
    </template>

    <!-- reactions モード -->
    <template v-if="mode === 'reactions' && reactionTrigger">
      <div class="flex items-center gap-1.5 text-xs">
        <Smile class="w-3 h-3 shrink-0 opacity-60" />
        <span class="opacity-70">種別:</span>
        <span class="badge badge-xs badge-secondary">{{ reactionTrigger.comparison }}</span>
      </div>
      <div v-if="reactionTrigger.reactions?.length" class="flex items-start gap-1 text-xs">
        <Heart class="w-3 h-3 shrink-0 opacity-60 mt-0.5" />
        <div class="flex flex-wrap gap-1">
          <span v-for="r in reactionTrigger.reactions.slice(0, 4)" :key="r" class="badge badge-xs badge-accent">{{
            r
          }}</span>
          <span v-if="reactionTrigger.reactions.length > 4" class="text-xs opacity-50">
            +{{ reactionTrigger.reactions.length - 4 }}
          </span>
        </div>
      </div>
      <div class="flex items-center gap-1.5 text-xs">
        <Hash class="w-3 h-3 shrink-0 opacity-60" />
        <span class="opacity-70">閾値:</span>
        <span class="font-mono">{{ reactionTrigger.value ?? 1 }}</span>
        <span v-if="reactionTrigger.triggerLevel" class="badge badge-xs badge-ghost">
          Lv{{ reactionTrigger.triggerLevel }}+
        </span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Filter, Activity, Clock, Smile, Heart, Hash } from 'lucide-vue-next'
  import type { ServiceTriggerType } from '@/types/OmikujiData/ServiceTriggerSchema'
  import type { ReactionTriggerType } from '@/types/OmikujiData/ReactionTriggerSchema'

  const props = defineProps<{
    data: { trigger?: Partial<ServiceTriggerType> | Partial<ReactionTriggerType> } | null
    mode?: 'metas' | 'reactions'
  }>()

  const serviceTrigger = computed(() =>
    props.mode === 'metas' ? (props.data?.trigger as Partial<ServiceTriggerType>) : null
  )
  const reactionTrigger = computed(() =>
    props.mode === 'reactions' ? (props.data?.trigger as Partial<ReactionTriggerType>) : null
  )
</script>
