<!-- src/configMaker/components/timers/TimerRuleEditor.vue -->
<template>
  <!-- タブ部分 -->
  <RecordTabs />

  <!-- ルール編集エリア -->
  <div v-if="selectedItem">
    <!-- 基本設定セクション -->
    <BaseSettingsEditor v-model="selectedItem" category="timers" />
    <div v-if="selectedItem.isEnabled !== false">
      <!-- タイマー設定セクション -->
      <TimerIntervalEditor v-model="selectedItem" />

      <!-- おみくじ設定セクション -->
      <OmikujiSetEditor category="timers" :selectedRuleId="selectedRuleId" />
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
  import { TimerRuleType } from '@/types/'
  import TimerIntervalEditor from './TimerIntervalEditor.vue'
  import OmikujiSetEditor from '@ConfigComponents/rules/OmikujiSetEditor.vue'
  import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue'
  import BaseSettingsEditor from '@ConfigComponents/rules/BaseSettingsEditor.vue'
  import InformationCard from '@ConfigComponents/parts/InformationCard.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  // ストアを使用
  const omikujiStore = useOmikujiStore()
  const { data, selectedRuleId } = storeToRefs(omikujiStore)

  const selectedItem = computed({
    get: () => {
      if (!selectedRuleId.value) return null
      return data.value.timers[selectedRuleId.value]
    },
    set: (value: TimerRuleType) => {
      omikujiStore.updateItem('timers', value.id, value)
    },
  })
</script>
