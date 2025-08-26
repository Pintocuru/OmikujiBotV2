<!-- src/configMaker/components/placeholders/PlaceholderItem.vue -->
<template>
  <div :class="cardClasses" @click="$emit('click', placeholder.id)">
    <div class="flex items-center justify-between p-2 gap-3 cursor-pointer">
      <!-- プレースホルダー情報 -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <!-- editorColorインジケーター -->
          <div
            v-if="placeholder.editorColor"
            class="w-3 h-3 rounded-full flex-shrink-0"
            :style="{ backgroundColor: placeholder.editorColor }"
            :title="`Color: ${placeholder.editorColor}`"
          />
          <div v-else class="w-3 h-3 rounded-full border border-base-content/20 flex-shrink-0" title="カラーなし" />

          <span class="font-medium text-sm truncate">
            {{ placeholder.name || placeholder.id }}
          </span>
          <code class="badge badge-xs bg-base-200 whitespace-nowrap"> ID: {{ placeholder.id }} </code>
          <div class="badge badge-outline badge-xs">
            {{ placeholder.values.length }}
          </div>
          <div v-if="isUsed" class="badge badge-primary badge-xs whitespace-nowrap">使用中</div>
          <div v-if="isDefault" class="badge badge-secondary badge-xs whitespace-nowrap">標準</div>
        </div>
        <div class="text-xs text-base-content/60 truncate mt-0.5">
          {{ randomValue }}
        </div>
      </div>

      <!-- アクションボタン -->
      <div class="flex items-center gap-1" @click.stop>
        <CopyButton :value="`<<${placeholder.id}>>`" data-tip="IDをコピー" :small="true" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { PlaceholderType } from '@/types/'
  import CopyButton from '@ConfigComponents/parts/CopyButton.vue'

  // Props
  const props = defineProps<{
    placeholder: PlaceholderType
    isUsed: boolean
    isDefault: boolean
    randomValue: string
  }>()

  // Emits
  defineEmits<{
    click: [placeholderId: string]
  }>()

  // Computed
  const cardClasses = computed(() => [
    'card card-compact transition-colors hover:shadow-sm',
    props.isUsed ? 'bg-primary/20 border border-primary/40 hover:bg-primary/30' : 'bg-base-100 hover:bg-base-200',
  ])
</script>
