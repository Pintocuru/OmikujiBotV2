<!-- src/ConfigMaker/components/placeholders/PlaceholderList.vue -->
<!-- !使用しない -->
<template>
  <div class="card card-body p-4 bg-base-200">
    <!-- カラーフィルター（editorColorが指定されていない場合のみ表示） -->
    <div v-if="!editorColor && editorColorOptions.length > 1" class="flex flex-wrap items-center gap-2">
      <span class="text-sm font-medium">カラー:</span>
      <button
        @click="selectedEditorColor = null"
        :class="[
          'px-3 py-1 text-xs rounded-full border transition-all',
          selectedEditorColor === null
            ? 'bg-primary text-primary-content border-primary'
            : 'bg-base-100 border-base-300 hover:bg-base-200',
        ]"
      >
        すべて ({{ stats.total }})
      </button>
      <button
        v-for="option in editorColorOptions.filter((opt) => opt.value !== null)"
        :key="option.value || 'no-color'"
        @click="selectEditorColor(option.value)"
        :class="[
          'flex items-center gap-2 px-3 py-1 text-xs rounded-full border transition-all',
          selectedEditorColor === option.value
            ? 'bg-primary text-primary-content border-primary'
            : 'bg-base-100 border-base-300 hover:bg-base-200',
        ]"
      >
        <div
          v-if="option.value"
          class="w-3 h-3 rounded-full border border-white/20"
          :style="{ backgroundColor: option.value }"
        />
        <div v-else class="w-3 h-3 rounded-full border border-base-content/20" />
        <span class="font-mono">{{ option.value || 'カラーなし' }}</span>
        <span>({{ option.count }})</span>
      </button>
    </div>

    <!-- プレースホルダーリスト -->
    <div class="grid grid-cols-2 gap-2 h-64 overflow-x-hidden content-start">
      <PlaceholderItem
        v-for="placeholder in filteredPlaceholders"
        :key="placeholder.id"
        :placeholder="placeholder"
        :is-used="usedPlaceholderIds.has(placeholder.key)"
        :is-default="defaultPlaceholders.includes(placeholder.key)"
        @dblclick="emit('openPlaceholder', placeholder.key, placeholder.editorColor)"
      />
    </div>

    <!-- プレースホルダーが見つからない場合 -->
    <div v-if="filteredPlaceholders.length === 0">
      <NoParamsCard
        :message="
          editorColor
            ? `指定されたカラー「${editorColor}」に一致するプレースホルダーがありません`
            : '選択したカラーに一致するプレースホルダーがありません'
        "
        iconName="Search"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { toRef } from 'vue'
  import { PostFlowType } from '@/types'
  import { usePlaceholders } from './composables/usePlaceholders'
  import PlaceholderItem from './PlaceholderItem.vue'
  import NoParamsCard from '@shared/components/parts/NoParamsCard.vue'

  // Props
  const props = defineProps<{
    actions?: PostFlowType[]
    editorColor?: string // 新しく追加
  }>()

  const emit = defineEmits(['openPlaceholder'])

  const {
    selectedEditorColor,
    filteredPlaceholders,
    usedPlaceholderIds,
    editorColorOptions,
    defaultPlaceholders,
    stats,
    selectEditorColor,
  } = usePlaceholders(
    toRef(() => props.actions || []),
    toRef(() => props.editorColor)
  )
</script>
