<!-- src/ConfigMaker/components/eventsTimer/TimerEditor.vue -->
<template>
  <!-- 便利ボタン群 -->
  <div class="flex justify-end gap-2">
    <GlobalCharacterChanger category="timers" />
     <IconKeyChanger category="timers" />  
  </div>

  <!-- タブ部分 -->
  <RecordTabs />

  <!-- イベント編集エリア -->
  <template v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :variant="selectedItem.isEnabled ? 'secondary' : 'neutral'"
      :title="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="timers" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled">
      <!-- タイマー設定セクション -->
      <SectionCard
        id="section-timerInterval"
        :icon="s('timerInterval')?.icon"
        :isOpen="activeSection === 'timerInterval'"
        @toggle="toggleSection('timerInterval')"
        :title="s('timerInterval')?.label"
        :description="s('timerInterval')?.description"
      >
        <TimerIntervalEditor v-model="selectedItem" />
      </SectionCard>

      <!-- おみくじ設定セクション -->
      <SectionCard
        id="section-omikujiSet"
        :icon="s('omikujiSet')?.icon"
        :isOpen="activeSection === 'omikujiSet'"
        @toggle="toggleSection('omikujiSet')"
        :title="s('omikujiSet')?.label"
        :description="s('omikujiSet')?.description"
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
  import { computed } from 'vue'
  import { TimerEventType } from '@/types/OmikujiData/'
  import GlobalCharacterChanger from '../events/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@config/components/events/IconKeyChanger/IconKeyChanger.vue'
  import TimerIntervalEditor from './TimerIntervalEditor.vue'
  import OmikujiSetEditor from '@config/components/events/OmikujiSetEditor.vue'
  import RecordTabs from '@config/components/RecordTabs/RecordTabs.vue'
  import BaseSettingsEditor from '@config/components/common/BaseSettingsEditor.vue'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import { staticSectionMap } from '../appItems/navigation/StaticSectionMap'

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'timerInterval' | 'omikujiSet' | null
  const navigationStore = useNavigationStore()
  const { selectedItemKey, activeSection } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  const s = (key: string) => staticSectionMap.timers.find((i) => i.section === key)

  // Pinia store
  const { updateItem } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getItem('timers', selectedItemKey.value)
    },
    set: (value: TimerEventType) => {
      updateItem('timers', value.key, value)
    },
  })
</script>
