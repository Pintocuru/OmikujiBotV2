<!-- src/ConfigMaker/components/appItems/preview/ActionSetPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-[180px] max-w-[260px]">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between pb-0.5 border-b border-base-300">
      <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70">
        <Zap class="w-3 h-3" />
        <span>アクションセット</span>
      </div>
      <!-- type バッジ -->
      <span class="badge badge-xs" :class="typeBadgeClass">{{ typeLabel }}</span>
    </div>

    <!-- postActions -->
    <template v-if="data?.type === 'postActions' || !data?.type">
      <div class="flex items-center justify-between text-xs">
        <div class="flex items-center gap-1 opacity-70">
          <Play class="w-3 h-3" />
          <span>アクション</span>
        </div>
        <span class="badge badge-xs badge-primary">{{ postActions.length }}件</span>
      </div>

      <div v-if="!postActions.length" class="text-xs opacity-40 ml-4">未設定</div>

      <div v-for="(action, i) in postActions.slice(0, 3)" :key="i" class="flex items-center gap-1.5 text-xs ml-1">
        <!-- actionType バッジ -->
        <span class="badge badge-xs shrink-0" :class="actionTypeBadgeClass(action.actionType)">
          {{ actionTypeLabel(action.actionType) }}
        </span>

        <!-- message の bubble テキスト -->
        <span v-if="action.actionType === 'message' && action.message?.bubble" class="truncate flex-1 opacity-80">
          {{ action.message.bubble.slice(0, 20) }}{{ action.message.bubble.length > 20 ? '…' : '' }}
        </span>

        <!-- characterKey -->
        <span v-if="action.actionType === 'message' && action.characterKey" class="badge badge-xs badge-ghost shrink-0">
          {{ action.characterKey }}
        </span>

        <!-- wordParty パターン -->
        <span v-if="action.actionType === 'wordParty' && action.wordParty" class="truncate flex-1 opacity-80 font-mono">
          {{ action.wordParty }}
        </span>

        <!-- actionSet 呼び出しキー数 -->
        <span v-if="action.actionType === 'actionSet'" class="opacity-60 text-xs">
          ×{{ action.actionSetKeys?.length ?? 0 }}
        </span>
      </div>

      <div v-if="postActions.length > 3" class="text-xs opacity-40 text-right">…他 {{ postActions.length - 3 }} 件</div>
    </template>

    <!-- gameScripts -->
    <template v-else-if="data?.type === 'gameScripts'">
      <div class="flex items-center gap-1.5 text-xs">
        <Gamepad2 class="w-3 h-3 shrink-0 opacity-60" />
        <span class="opacity-70">スクリプト:</span>
        <span class="badge badge-xs badge-ghost font-mono">
          {{ data.gameScripts?.scriptId ?? '未設定' }}
        </span>
      </div>
      <div v-if="data.gameScripts?.queryString" class="flex items-center gap-1.5 text-xs">
        <Hash class="w-3 h-3 shrink-0 opacity-60" />
        <span class="truncate font-mono opacity-70">{{ data.gameScripts.queryString }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Zap, Play, Gamepad2, Hash } from 'lucide-vue-next'
  import type { ActionSetType } from '@/types/OmikujiData/ActionSet'

  const props = defineProps<{
    data: Partial<ActionSetType> | null
  }>()

  const postActions = computed(() => props.data?.postActions ?? [])

  const typeLabel = computed(() => {
    const map: Record<string, string> = {
      postActions: 'アクション',
      gameScripts: 'ゲーム',
    }
    return map[props.data?.type ?? 'postActions'] ?? props.data?.type ?? '—'
  })

  const typeBadgeClass = computed(() => {
    const map: Record<string, string> = {
      postActions: 'badge-primary',
      gameScripts: 'badge-accent',
    }
    return map[props.data?.type ?? 'postActions'] ?? 'badge-ghost'
  })

  function actionTypeLabel(type: string) {
    const map: Record<string, string> = {
      message: 'MSG',
      sound: 'SND',
      wordParty: 'WP',
      actionSet: 'CALL',
      bot: 'BOT',
    }
    return map[type] ?? type
  }

  function actionTypeBadgeClass(type: string) {
    const map: Record<string, string> = {
      message: 'badge-primary',
      sound: 'badge-secondary',
      wordParty: 'badge-accent',
      actionSet: 'badge-warning',
      bot: 'badge-info',
    }
    return map[type] ?? 'badge-ghost'
  }
</script>
