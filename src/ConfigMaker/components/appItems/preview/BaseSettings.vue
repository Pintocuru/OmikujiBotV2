<!-- src/ConfigMaker/components/appItems/preview/BaseSettings.vue -->
<template>
  <div class="text-xs space-y-1 max-w-xs">
    <!-- name -->
    <div class="font-semibold truncate">
      {{ data.name || '(no name)' }}
    </div>

    <!-- key -->
    <div class="opacity-60 break-all">
      {{ data.key }}
    </div>

    <!-- description -->
    <div class="opacity-70 line-clamp-3">
      {{ data.description || '説明なし' }}
    </div>

    <!-- tags -->
    <div class="flex flex-wrap gap-1">
      <span v-for="tag in data.tags" :key="tag" class="badge badge-xs">
        {{ tag }}
      </span>
    </div>

    <!-- isEnabled -->
    <div class="pt-1">
      <span class="badge badge-xs" :class="data.isEnabled ? 'badge-success' : 'badge-ghost'">
        {{ data.isEnabled ? '有効' : '無効' }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { BaseRecordType } from '@shared/types'

  defineProps<{
    data: BaseRecordType
  }>()
</script>
