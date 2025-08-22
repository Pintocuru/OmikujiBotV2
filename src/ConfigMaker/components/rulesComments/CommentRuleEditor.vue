<!-- src/configMaker/components/comments/CommentRuleEditor.vue -->
<template>
  <!-- タブ部分 -->
  <RecordTabs />

  <!-- ルール編集エリア -->
  <div v-if="selectedItem">
    <!-- 基本設定セクション -->
    <BaseSettingsEditor v-model="selectedItem" category="comments" />
    <div v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <CommentThresholdEditor v-model="selectedItem.threshold" :selectedRuleId="selectedRuleId" />

      <!-- おみくじ制限設定セクション -->
      <OmikujiLimitsEditor v-model="selectedItem.limits" :selectedRuleId="selectedRuleId" />

      <!-- ゲームスクリプト設定セクション -->
      <ScriptGameEditor v-model="selectedItem" />

      <!-- おみくじ設定セクション -->
      <OmikujiSetEditor category="comments" :selectedRuleId="selectedRuleId" />
    </div>
    <!-- 無効のときのメッセージ -->
    <InformationCard v-else class="mt-4 p-4">
      現在、このルールは無効になっています。<br />
      編集を行うには、まずルールを有効にしてください。
    </InformationCard>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { CommentRuleType } from '@/types/OmikujiData/RulesSchema'
  import BaseSettingsEditor from '../rules/BaseSettingsEditor.vue'
  import ScriptGameEditor from './GameScriptEditor.vue'
  import OmikujiSetEditor from '../rules/OmikujiSetEditor.vue'
  import OmikujiLimitsEditor from '@/ConfigMaker/components/rulesComments/OmikujiLimitsEditor.vue'
  import InformationCard from '@ConfigComponents/parts/InformationCard.vue'
  import CommentThresholdEditor from '@ConfigComponents/threshold/ThresholdEditor.vue'
  import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { data, selectedRuleId } = storeToRefs(omikujiStore)

  // v-modelを使用したselectedCharacterの実装
  const selectedItem = computed({
    get: () => {
      if (!selectedRuleId.value) return null
      return data.value.comments[selectedRuleId.value]
    },
    set: (value: CommentRuleType) => {
      omikujiStore.updateItem('comments', value.id, value)
    },
  })
</script>
