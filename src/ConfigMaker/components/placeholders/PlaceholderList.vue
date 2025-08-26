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
      <!-- FIXME:「カラーなし」は必ず選択できず、かわりに「すべてに選択」の機能と同様になっている。 -->
      <div v-if="editorColorOptions.length > 1" class="flex flex-wrap items-center gap-2">
        <span class="text-sm font-medium">カラー:</span>
        <button
          @click="selectedEditorColor = undefined"
          :class="[
            'px-3 py-1 text-xs rounded-full border transition-all',
            selectedEditorColor === undefined
              ? 'bg-primary text-primary-content border-primary'
              : 'bg-base-100 border-base-300 hover:bg-base-200',
          ]"
        >
          すべて ({{ stats.total }})
        </button>
        <button
          v-for="option in editorColorOptions.filter((opt) => opt.value !== undefined)"
          :key="option.value"
          @click="selectedEditorColor = selectedEditorColor === option.value ? undefined : option.value"
          :class="[
            'flex items-center gap-2 px-3 py-1 text-xs rounded-full border transition-all',
            selectedEditorColor === option.value
              ? 'bg-primary text-primary-content border-primary'
              : 'bg-base-100 border-base-300 hover:bg-base-200',
          ]"
        >
          <div class="w-3 h-3 rounded-full border border-white/20" :style="{ backgroundColor: option.value }" />
          <span class="font-mono">{{ option.value }}</span>
          <span>({{ option.count }})</span>
        </button>
        <button
          v-if="editorColorOptions.find((opt) => opt.value === undefined)"
          @click="selectedEditorColor = selectedEditorColor === undefined ? undefined : undefined"
          :class="[
            'flex items-center gap-2 px-3 py-1 text-xs rounded-full border transition-all',
            selectedEditorColor === undefined && stats.filtered < stats.total
              ? 'bg-primary text-primary-content border-primary'
              : 'bg-base-100 border-base-300 hover:bg-base-200',
          ]"
        >
          <div class="w-3 h-3 rounded-full border border-base-content/20" />
          <span>カラーなし</span>
          <span>({{ editorColorOptions.find((opt) => opt.value === undefined)?.count || 0 }})</span>
        </button>
      </div>

      <!-- プレースホルダーリスト -->
      <!-- FIXME:refreshRandomValueは、クリックすると、すべての項目が変化してしまう。個別の箇所のみ変化して欲しい。 -->
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
  // FIXME:リアクティブになっておらず「使用中」が必ず表示されない。usePlaceholdersの引数はRefを使用して欲しい。
  const {
    selectedEditorColor,
    filteredPlaceholders,
    usedPlaceholderIds,
    editorColorOptions,
    getRandomValue,
    refreshRandomValue,
    defaultPlaceholders,
    stats,
  } = usePlaceholders(props.actions)
</script>
