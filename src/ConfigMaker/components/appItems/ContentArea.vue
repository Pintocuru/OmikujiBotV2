<!-- src/configMaker/components/ContentArea.vue -->
<template>
  <div class="card bg-base-200 mt-4">
    <div class="card-title p-4 rounded-t justify-between bg-primary text-primary-content">
      <div class="flex text-xl items-center gap-2">
        <component :is="categoryLabels[selectedCategory].icon" class="w-6 h-6" />
        {{ categoryLabels[selectedCategory].label }}
      </div>
      <div class="text-sm pr-2">
        {{ categoryLabels[selectedCategory].description }}
      </div>
    </div>
    <div class="card-body space-y-4">
      <!-- コメントルール -->
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
  import { categoryLabels } from '@/types/OmikujiData/CategoryType'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import CommentRuleEditor from '@ConfigComponents/rulesComments/CommentRuleEditor.vue'
  import TimerRuleEditor from '@ConfigComponents/rulesTimers/TimerRuleEditor.vue'
  import ActionSetsEditor from '@ConfigComponents/actionSets/ActionSetsEditor.vue'
  import PlaceholderEditor from '@ConfigComponents/placeholders/PlaceholderEditor.vue'
  import CharacterEditor from '@ConfigComponents/characters/CharacterEditor.vue'
  import ComponentEditor from '@/ConfigMaker/components/componentEditor/ComponentEditor.vue'
  import AppInfoEditor from '@ConfigComponents/appInfo/AppInfoEditor.vue'
  import JsonMergeEditor from '@ConfigComponents/JsonMerge/JsonMergeEditor.vue'

  const omikujiStore = useOmikujiStore()
  const { selectedCategory } = storeToRefs(omikujiStore)
</script>
