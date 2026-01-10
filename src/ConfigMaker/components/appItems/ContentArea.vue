<!-- src\ConfigMaker\components\appItems\ContentArea.vue -->
<template>
  <!-- カテゴリ帯 -->
  <div class="flex items-center justify-between px-4 py-3 bg-primary text-primary-content">
    <div class="flex items-center gap-2 text-lg font-bold">
      <component :is="categoryLabels[selectedCategory].icon" class="w-6 h-6" />
      {{ categoryLabels[selectedCategory].label }}
    </div>

    <div class="text-sm opacity-80">
      {{ categoryLabels[selectedCategory].description }}
    </div>
  </div>

  <!-- Jsonマージ(Dev) -->
  <JsonMergeEditor v-if="selectedCategory === 'jsonMerge'" />

  <!-- コメントルール -->
  <CommentRuleEditor v-else-if="selectedCategory === 'comments'" />

  <!-- タイマールール -->
  <TimerRuleEditor v-else-if="selectedCategory === 'timers'" />

  <!-- アクションセット -->
  <ActionSetsEditor v-else-if="selectedCategory === 'actionSets'" />

  <!-- プレースホルダー -->
  <PlaceholderEditor v-else-if="selectedCategory === 'placeholders'" />

  <!-- キャラクター設定 -->
  <CharacterEditor v-else-if="selectedCategory === 'characters'" />

  <!-- 表示設定 -->
  <ComponentEditor v-else-if="selectedCategory === 'components'" />

  <!-- アプリ情報 -->
  <AppInfoEditor v-else-if="selectedCategory === 'appInfo'" />
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { categoryLabels } from '@/types/OmikujiData/'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import CommentRuleEditor from '@config/components/rulesComments/CommentRuleEditor.vue'
  import TimerRuleEditor from '@config/components/rulesTimers/TimerRuleEditor.vue'
  import ActionSetsEditor from '@config/components/actionSets/ActionSetsEditor.vue'
  import PlaceholderEditor from '@config/components/placeholders/PlaceholderEditor.vue'
  import CharacterEditor from '@config/components/characters/CharacterEditor.vue'
  import ComponentEditor from '@config/components/componentEditor/ComponentEditor.vue'
  import AppInfoEditor from '@config/components/appInfo/AppInfoEditor.vue'
  import JsonMergeEditor from '@config/components/JsonMerge/JsonMergeEditor.vue'

  const navigationStore = useNavigationStore()
  const { selectedCategory } = storeToRefs(navigationStore)
</script>
