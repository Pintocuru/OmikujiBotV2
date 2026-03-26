<!-- src/ConfigMaker/components/appItems/preview/ThresholdPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-[180px] max-w-[240px]">
    <!-- ヘッダー -->
    <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70 pb-0.5 border-b border-base-300">
      <Filter class="w-3 h-3" />
      <span>{{ title }}</span>
    </div>

    <!-- conditions バッジ群 -->
    <div v-if="conditions.length" class="flex flex-wrap gap-1">
      <span v-for="cond in conditions" :key="cond" class="badge badge-xs" :class="conditionBadgeClass(cond)">
        {{ conditionLabel(cond) }}
      </span>
    </div>
    <div v-else class="text-xs opacity-40">条件なし（すべて発動）</div>

    <!-- userName -->
    <div v-if="trigger.userName?.length" class="flex items-center gap-1 text-xs">
      <User class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">ユーザー:</span>
      <span class="truncate max-w-[120px]">
        {{ trigger.userName.slice(0, 2).join(', ') }}
        <span v-if="trigger.userName.length > 2" class="opacity-50">+{{ trigger.userName.length - 2 }}</span>
      </span>
    </div>

    <!-- comment キーワード -->
    <div v-if="trigger.comment?.length" class="flex items-start gap-1 text-xs">
      <MessageSquare class="w-3 h-3 shrink-0 opacity-60 mt-0.5" />
      <div class="flex flex-wrap gap-1">
        <span v-for="kw in trigger.comment.slice(0, 3)" :key="kw" class="badge badge-xs badge-ghost font-mono">{{
          kw
        }}</span>
        <span v-if="trigger.comment.length > 3" class="text-xs opacity-50">+{{ trigger.comment.length - 3 }}</span>
      </div>
    </div>

    <!-- access / gift 件数バッジ -->
    <div v-if="trigger.access?.length || trigger.gift?.length" class="flex gap-1.5 text-xs">
      <div v-if="trigger.access?.length" class="flex items-center gap-1">
        <Shield class="w-3 h-3 opacity-60" />
        <span class="badge badge-xs badge-info">アクセス ×{{ trigger.access.length }}</span>
      </div>
      <div v-if="trigger.gift?.length" class="flex items-center gap-1">
        <Gift class="w-3 h-3 opacity-60" />
        <span class="badge badge-xs badge-warning">ギフト ×{{ trigger.gift.length }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Filter, User, MessageSquare, Shield, Gift } from 'lucide-vue-next'
  import type { CommentTriggerType } from '@/types/OmikujiData/CommentTriggerSchema'
  import type { CriteriaThresholdType } from '@/types/OmikujiData/CriteriaThresholdSchema'

  type TriggerLike = Partial<CommentTriggerType & CriteriaThresholdType>

  const props = withDefaults(
    defineProps<{
      data: { trigger?: TriggerLike; criteria?: TriggerLike | null } | null
      /** 'threshold'（発動条件）or 'criteria'（追加発動条件） */
      mode?: 'threshold' | 'criteria'
    }>(),
    { mode: 'threshold' }
  )

  const title = computed(() => (props.mode === 'criteria' ? '追加発動条件' : '発動条件'))

  const trigger = computed<TriggerLike>(() => {
    if (!props.data) return {}
    if (props.mode === 'criteria') return props.data.criteria ?? {}
    return props.data.trigger ?? {}
  })

  const conditions = computed(() => trigger.value.conditions ?? [])

  const conditionLabelMap: Record<string, string> = {
    syoken: '初見',
    count: 'カウント',
    access: 'アクセス',
    gift: 'ギフト',
    comment: 'キーワード',
    userName: 'ユーザー指定',
  }

  function conditionLabel(cond: string) {
    return conditionLabelMap[cond] ?? cond
  }

  function conditionBadgeClass(cond: string) {
    const map: Record<string, string> = {
      syoken: 'badge-primary',
      count: 'badge-secondary',
      access: 'badge-info',
      gift: 'badge-warning',
      comment: 'badge-accent',
      userName: 'badge-neutral',
    }
    return map[cond] ?? 'badge-ghost'
  }
</script>
