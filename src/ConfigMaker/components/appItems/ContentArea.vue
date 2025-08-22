<!-- src/configMaker/components/ContentArea.vue -->
<template>
  <div class="card bg-base-200 mt-4">
    <div class="card-title p-4 rounded-t justify-between bg-primary text-primary-content">
      <div class="flex items-center gap-2">
        <component :is="categoryLabels[selectedCategory].icon" class="w-5 h-5" />
        {{ categoryLabels[selectedCategory].label }}
      </div>
      <div class="text-sm pr-2">
        {{ categoryLabels[selectedCategory].description }}
      </div>
    </div>
    <div class="card-body space-y-4">
      <!-- コメントルール -->
      <CommentRuleEditor v-if="selectedCategory === 'comments'" />

      <!-- タイマールール -->
      <TimerRuleEditor v-else-if="selectedCategory === 'timers'" />

      <!-- プレースホルダー -->
      <PlaceholderEditor v-else-if="selectedCategory === 'placeholders'" />

      <!-- キャラクター設定 -->
      <CharacterEditor v-else-if="selectedCategory === 'characters'" />

      <!-- スクリプト設定 -->
      <ScriptSettingsEditor v-else-if="selectedCategory === 'scriptSettings'" />

      <!-- 表示設定 -->
      <DisplaySettingsEditor v-else-if="selectedCategory === 'displaySettings'" />

      <!-- WordParty設定 -->
      <WordPartySettingsEditor v-else-if="selectedCategory === 'wordPartySettings'" />

      <!-- Meta設定 -->
      <PackageMetaEditor v-else-if="selectedCategory === 'meta'" />

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
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import CommentRuleEditor from '@ConfigComponents/rulesComments/CommentRuleEditor.vue'
  import TimerRuleEditor from '@ConfigComponents/rulesTimers/TimerRuleEditor.vue'
  import PlaceholderEditor from '@ConfigComponents/placeholders/PlaceholderEditor.vue'
  import ScriptSettingsEditor from '@ConfigComponents/scriptSettings/ScriptSettingsEditor.vue'
  import WordPartySettingsEditor from '@ConfigComponents/wordPartySettings/WordPartySettingsEditor.vue'
  import CharacterEditor from '@ConfigComponents/characters/CharacterEditor.vue'
  import DisplaySettingsEditor from '@ConfigComponents/displaySettings/DisplaySettingsEditor.vue'
  import PackageMetaEditor from '@ConfigComponents/meta/PackageMetaEditor.vue'

  const omikujiStore = useOmikujiStore()
  const { selectedCategory } = storeToRefs(omikujiStore)
</script>
