<!-- src/ConfigMaker/components/eventsReaction/ReactionEditor.vue -->
<template>
  <!-- 便利ボタン群 -->
  <div class="flex justify-end gap-2">
    <GlobalCharacterChanger category="reactions" />
     <IconKeyChanger category="reactions" />  
  </div>

  <!-- タブ部分 -->
  <RecordTabs />

  <!-- イベント編集エリア -->
  <template v-if="selectedItem">
    <!-- 無効のときのメッセージ -->
    <InformationCard variant="info" class="mt-4 p-4">
      「リアクションイベント」は、Youtube の リアクションのみ対応しています。<br />
    </InformationCard>

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
      <BaseSettingsEditor v-model="selectedItem" category="reactions" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        id="section-trigger"
        :icon="s('trigger')?.icon"
        :isOpen="activeSection === 'trigger'"
        @toggle="toggleSection('trigger')"
        :title="s('trigger')?.label"
        :description="s('trigger')?.description"
      >
        <ReactionTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
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
        <OmikujiSetEditor category="reactions" :selectedItemKey="selectedItemKey" />
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
  import { ReactionEventType } from '@/types/OmikujiData/'
  import GlobalCharacterChanger from '../events/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@config/components/events/IconKeyChanger/IconKeyChanger.vue'
  import ReactionTriggerEditor from './ReactionTriggerEditor.vue'
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

  const s = (key: string) => staticSectionMap.reactions.find((i) => i.section === key)

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'trigger' | 'omikujiSet' | null

  // Pinia store
  const { updateItem } = useOmikujiStore()
  const { getItem } = useGetRecordData()
  const navigationStore = useNavigationStore()
  const { selectedItemKey, activeSection } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getItem('reactions', selectedItemKey.value)
    },
    set: (value: ReactionEventType) => {
      updateItem('reactions', value.key, value)
    },
  })
</script>
