<!-- src/ConfigMaker/components/appItems/preview/OmikujiSetPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-[180px] max-w-[240px]">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between pb-0.5 border-b border-base-300">
      <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70">
        <ListChecks class="w-3 h-3" />
        <span>おみくじ設定</span>
      </div>
      <span class="badge badge-xs badge-primary">{{ omikuji.length }}件</span>
    </div>

    <!-- 空 -->
    <div v-if="!omikuji.length" class="text-xs opacity-40">おみくじ未設定</div>

    <!-- アイテムリスト（最大5件） -->
    <div v-for="(item, i) in omikuji.slice(0, 5)" :key="i" class="flex items-center gap-1.5 text-xs">
      <!-- 優先度バッジ -->
      <span v-if="item.isPriority" class="badge badge-xs badge-accent shrink-0">優先</span>
      <span v-else class="opacity-40 shrink-0 tabular-nums w-3 text-right">{{ i + 1 }}</span>

      <!-- name -->
      <span class="truncate flex-1" :class="item.name ? '' : 'opacity-40 italic'">
        {{ item.name || '（名前なし）' }}
      </span>

      <!-- weight -->
      <span class="badge badge-xs badge-ghost shrink-0">×{{ item.weight ?? 1 }}</span>

      <!-- criteria あり -->
      <span v-if="hasCriteria(item)" class="text-accent" title="追加発動条件あり">
        <Filter class="w-2.5 h-2.5" />
      </span>
    </div>

    <!-- 省略表示 -->
    <div v-if="omikuji.length > 5" class="text-xs opacity-40 text-right">…他 {{ omikuji.length - 5 }} 件</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ListChecks, Filter } from 'lucide-vue-next'
  import type { OmikujiItemType } from '@/types/OmikujiData/OmikujiSchema'

  const props = defineProps<{
    data: { omikuji?: OmikujiItemType[] } | null
  }>()

  const omikuji = computed(() => props.data?.omikuji ?? [])

  function hasCriteria(item: OmikujiItemType) {
    if (!item.criteria) return false
    const c = item.criteria
    return (
      (c.conditions?.length ?? 0) > 0 ||
      (c.userName?.length ?? 0) > 0 ||
      (c.comment?.length ?? 0) > 0 ||
      (c.access?.length ?? 0) > 0 ||
      (c.gift?.length ?? 0) > 0
    )
  }
</script>
