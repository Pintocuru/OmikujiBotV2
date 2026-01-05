<!-- src\ConfigMaker\components\appItems\ContentArea.vue -->
<template>
  <div class="card bg-base-200">
    <div class="card-title p-4 bg-primary text-primary-content flex justify-between rounded-t">
      <div class="flex text-xl items-center gap-2">
        <component :is="categoryLabels[selectedCategory].icon" class="w-6 h-6" />
        {{ categoryLabels[selectedCategory].label }}
      </div>
      <div class="text-sm">
        {{ categoryLabels[selectedCategory].description }}
      </div>
    </div>
    <div class="card-body">
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

      <!-- フォールバック -->
      <div v-else>
        <p class="text-gray-600">不明なカテゴリ: {{ selectedCategory }}</p>
      </div>
    </div>
  </div>
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
