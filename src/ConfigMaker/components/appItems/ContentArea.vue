<!-- src/ConfigMaker/components/appItems/ContentArea.vue -->
<template>
  <!-- カテゴリ帯 -->
  <div class="flex items-center justify-between px-4 py-3 bg-primary text-primary-content">
    <div class="flex items-center gap-2 text-lg font-bold">
      <component :is="resolveLucideIcon(categoryMap[selectedCategory].icon)" class="w-6 h-6" />
      {{ categoryMap[selectedCategory].label }}
    </div>

    <div class="text-sm opacity-80">
      {{ categoryMap[selectedCategory].description }}
    </div>
  </div>

  <!-- Jsonマージ(Dev) -->
  <JsonMergeEditor v-if="selectedCategory === 'jsonMerge'" />

  <!-- コメントルール -->
  <CommentRuleEditor v-else-if="selectedCategory === 'comments'" />

  <!-- タイマールール -->
  <TimerRuleEditor v-else-if="selectedCategory === 'timers'" />

  <!-- メタルール -->
  <MetaRuleEditor v-else-if="selectedCategory === 'metas'" />

  <!-- アクションセット -->
  <ActionSetsEditor v-else-if="selectedCategory === 'actionSets'" />

  <!-- プレースホルダー -->
  <PlaceholderEditor v-else-if="selectedCategory === 'placeholders'" />

  <!-- キャラクター設定 -->
  <CharacterEditor v-else-if="selectedCategory === 'characters'" />

  <!-- アイテム設定 -->
  <ComponentEditor v-else-if="selectedCategory === 'components'" />

  <!-- アプリ情報 -->
  <AppInfoEditor v-else-if="selectedCategory === 'appInfo'" />
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { categoryMap } from '@/types/'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import CommentRuleEditor from '@config/components/rulesComments/CommentRuleEditor.vue'
  import TimerRuleEditor from '@config/components/rulesTimers/TimerRuleEditor.vue'
  import MetaRuleEditor from '@config/components/rulesMetas/MetaRuleEditor.vue'
  import ActionSetsEditor from '@config/components/actionSets/ActionSetsEditor.vue'
  import PlaceholderEditor from '@config/components/placeholders/PlaceholderEditor.vue'
  import CharacterEditor from '@config/components/characters/CharacterEditor.vue'
  import ComponentEditor from '@config/components/componentEditor/ComponentEditor.vue'
  import AppInfoEditor from '@config/components/appInfo/AppInfoEditor.vue'
  import JsonMergeEditor from '@config/components/JsonMerge/JsonMergeEditor.vue'
  import { resolveLucideIcon } from '../common/useLucideIcon'

  const navigationStore = useNavigationStore()
  const { selectedCategory } = storeToRefs(navigationStore)
</script>
