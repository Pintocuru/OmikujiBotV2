<!-- src/ConfigMaker/components/appItems/preview/PlaceholderPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-[180px] max-w-[240px]">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between pb-0.5 border-b border-base-300">
      <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70">
        <Brackets class="w-3 h-3" />
        <span>プレースホルダー</span>
      </div>
      <span class="badge badge-xs badge-primary">{{ values.length }}件</span>
    </div>

    <div v-if="!values.length" class="text-xs opacity-40">値未設定</div>

    <!-- 値リスト（最大6件） -->
    <div v-for="(item, i) in normalizedValues.slice(0, 6)" :key="i" class="flex items-center gap-1.5 text-xs">
      <!-- weight > 1 のみバッジ表示 -->
      <span v-if="item.weight !== 1" class="badge badge-xs badge-warning shrink-0">×{{ item.weight }}</span>
      <span v-else class="w-3 shrink-0" />
      <span class="truncate flex-1" :class="item.content ? '' : 'opacity-40 italic'">
        {{ item.content || '（空）' }}
      </span>
    </div>

    <div v-if="values.length > 6" class="text-xs opacity-40 text-right">…他 {{ values.length - 6 }} 件</div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { Brackets } from 'lucide-vue-next'
  import type { PlaceholderType, WeightValuesArrayType, WeightValueType } from '@/types/OmikujiData/PlaceholderSchema'
  import { handelNormalizedValues } from '@/types/OmikujiData/PlaceholderSchema'

  const props = defineProps<{
    data: Partial<PlaceholderType> | null
  }>()

  const values = computed<WeightValuesArrayType>(() => props.data?.values ?? [])

  const normalizedValues = computed<WeightValueType[]>(() => handelNormalizedValues(values.value))
</script>
