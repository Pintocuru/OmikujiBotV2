<!-- src/ConfigMaker/components/rulesTimers/TimerRuleEditor.vue -->
<template>
  <!-- 便利ボタン群 -->
  <div class="flex justify-end gap-2">
    <GlobalCharacterChanger category="timers" />
  </div>

  <!-- タブ部分 -->
  <RecordTabs />

  <!-- イベント編集エリア -->
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

    <template v-if="selectedItem.isEnabled">
      <!-- タイマー設定セクション -->
      <SectionCard
        icon="Clock"
        :isOpen="activeSection === 'timerInterval'"
        @toggle="toggleSection('timerInterval')"
        title="タイマー設定"
        :subTitle="timerSubTitle"
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
      現在、このイベントは無効になっています。<br />
      編集を行うには、まずイベントを有効にしてください。
    </InformationCard>
  </template>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { TimerRuleType } from '@/types/OmikujiData/'
  import GlobalCharacterChanger from '../rules/CharacterChanger/CharacterChanger.vue'
  import TimerIntervalEditor from './TimerIntervalEditor.vue'
  import OmikujiSetEditor from '@config/components/rules/OmikujiSetEditor.vue'
  import RecordTabs from '@config/components/RecordTabs/RecordTabs.vue'
  import BaseSettingsEditor from '@config/components/common/BaseSettingsEditor.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'timerInterval' | 'omikujiSet' | null
  const activeSection = ref<SectionType>('omikujiSet') // 初期状態で基本設定を開く

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const { updateItem } = useOmikujiStore()
  const { getItem } = useGetRecordData()
  const navigationStore = useNavigationStore()
  const { selectedItemKey } = storeToRefs(navigationStore)

  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getItem('timers', selectedItemKey.value)
    },
    set: (value: TimerRuleType) => {
      updateItem('timers', value.key, value)
    },
  })

  const timerSubTitle = computed(() => {
    if (!selectedItem.value) return ''

    const item = selectedItem.value

    // 起動時のみ
    if (item.mode === 'onStart') {
      return '(起動時に一度だけ実行)'
    }

    // interval モード
    return `(${item.intervalSeconds}秒毎${item.isBaseZero ? '、基準調整あり' : ''})`
  })
</script>
