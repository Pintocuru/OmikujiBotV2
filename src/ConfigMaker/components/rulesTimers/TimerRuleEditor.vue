<!-- src/configMaker/components/timers/TimerRuleEditor.vue -->
<template>
  <!-- 便利ボタン群 -->
  <div class="flex justify-end gap-2">
    <GlobalCharacterChanger category="timers" />
  </div>

  <!-- タブ部分 -->
  <RecordTabs />

  <!-- ルール編集エリア -->
  <template v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      icon="SlidersHorizontal"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :variant="selectedItem.isEnabled ? 'secondary' : 'outline-secondary'"
      :title="selectedItem.name !== '' ? selectedItem.name : '名称未設定'"
      :description="selectedItem.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="timers" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- タイマー設定セクション -->
      <SectionCard
        icon="Clock"
        :isOpen="activeSection === 'timerInterval'"
        @toggle="toggleSection('timerInterval')"
        title="タイマー設定"
        :subTitle="`(${selectedItem.intervalSeconds}秒毎${selectedItem.isBaseZero ? '、基準調整あり' : ''})`"
        description="発動する間隔やタイミングの設定"
      >
        <TimerIntervalEditor v-model="selectedItem" />
      </SectionCard>

      <!-- おみくじ設定セクション -->
      <SectionCard
        icon="ListChecks"
        :isOpen="activeSection === 'omikujiSet'"
        @toggle="toggleSection('omikujiSet')"
        title="おみくじ設定"
        :subTitle="`(おみくじの数 : ${selectedItem.omikuji.length})`"
        description="おみくじの抽選設定や、おみくじの内容です"
      >
        <OmikujiSetEditor category="timers" :selectedItemKey="selectedItemKey" />
      </SectionCard>
    </template>

    <!-- 無効のときのメッセージ -->
    <InformationCard v-else variant="error" class="mt-4 p-4">
      現在、このルールは無効になっています。<br />
      編集を行うには、まずルールを有効にしてください。
    </InformationCard>
  </template>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { TimerRuleType } from '@/types/OmikujiData/RulesSchema'
  import GlobalCharacterChanger from '../rules/CharacterChanger/CharacterChanger.vue'
  import TimerIntervalEditor from './TimerIntervalEditor.vue'
  import OmikujiSetEditor from '@config/components/rules/OmikujiSetEditor.vue'
  import RecordTabs from '@config/components/RecordTabs/RecordTabs.vue'
  import BaseSettingsEditor from '@config/components/common/BaseSettingsEditor.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'timerInterval' | 'omikujiSet' | null
  const activeSection = ref<SectionType>('omikujiSet') // 初期状態で基本設定を開く

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { data, selectedItemKey } = storeToRefs(omikujiStore)

  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return data.value.timers[selectedItemKey.value]
    },
    set: (value: TimerRuleType) => {
      omikujiStore.updateItem('timers', value.key, value)
    },
  })
</script>
