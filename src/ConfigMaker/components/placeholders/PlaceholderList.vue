<!-- src/configMaker/components/placeholders/PlaceholderList.vue -->
<template>
  <SectionCard variant="primary">
    <template #header>
      <div>プレースホルダー一覧</div>
      <div class="flex items-center gap-2 text-sm">
        <span>プレースホルダー数: {{ stats.total }}</span>
        <span>(使用中: {{ stats.used }})</span>
      </div>
    </template>

    <template #body>
      <!-- カラーフィルター -->
      <div v-if="editorColorOptions.length > 1" class="flex flex-wrap items-center gap-2">
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
      <div class="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto overflow-x-hidden mx-auto">
        <PlaceholderItem
          v-for="(placeholder, index) in filteredPlaceholders"
          :key="`${placeholder.id}-${index}`"
          :placeholder="placeholder"
          :is-used="usedPlaceholderIds.has(placeholder.id)"
          :is-default="defaultPlaceholders.includes(placeholder.id)"
          :random-value="getRandomValue(placeholder)"
          @click="refreshRandomValue(placeholder.id)"
        />
      </div>

      <!-- プレースホルダーが見つからない場合 -->
      <div v-if="filteredPlaceholders.length === 0">
        <NoParamsCard message="選択したカラーに一致するプレースホルダーがありません" iconName="Search" />
      </div>
    </template>
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import { PostActionType } from '@/types/'
  import { usePlaceholders } from './composables/usePlaceholders'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import NoParamsCard from '@ConfigComponents/parts/NoParamsCard.vue'
  import PlaceholderItem from './PlaceholderItem.vue'

  // Props
  const props = defineProps<{
    actions?: PostActionType[]
  }>()

  // Composable
  const {
    selectedEditorColor,
    filteredPlaceholders,
    usedPlaceholderIds,
    editorColorOptions,
    getRandomValue,
    refreshRandomValue,
    defaultPlaceholders,
    stats,
    selectEditorColor,
  } = usePlaceholders(toRef(() => props.actions || []))
</script>
