<!-- src/ConfigMaker/components/eventsComment/CommentEditor.vue -->
<template>
  <!-- 便利ボタン群 -->
  <div class="flex justify-end gap-2">
    <!-- 全体キャラ変更 -->
    <GlobalCharacterChanger category="comments" />
     <IconKeyChanger category="comments" />  
  </div>

  <!-- タブ部分 -->
  <RecordTabs />

  <template v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :title="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="comments" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        id="section-threshold"
        :icon="s('threshold')?.icon"
        :isOpen="activeSection === 'threshold'"
        @toggle="toggleSection('threshold')"
        :title="s('threshold')?.label"
        :description="s('threshold')?.description"
      >
        <CommentTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
      </SectionCard>

      <!-- おみくじ制限設定セクション -->
      <SectionCard
        id="section-limits"
        :icon="s('limits')?.icon"
        :isOpen="activeSection === 'limits'"
        @toggle="toggleSection('limits')"
        :title="s('limits')?.label"
        :description="s('limits')?.description"
      >
        <OmikujiLimitsEditor v-model="selectedItem.limits" :selectedItemKey="selectedItemKey" />
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
        <OmikujiSetEditor category="comments" :selectedItemKey="selectedItemKey" />
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
  import { storeToRefs } from 'pinia'
  import { CommentEventType } from '@/types/OmikujiData/'
  import CommentTriggerEditor from './CommentTriggerEditor.vue'
  import OmikujiLimitsEditor from './OmikujiLimitsEditor.vue'
  import BaseSettingsEditor from '@config/components/common/BaseSettingsEditor.vue'
  import OmikujiSetEditor from '@config/components/events/OmikujiSetEditor.vue'
  import GlobalCharacterChanger from '@config/components/events/CharacterChanger/CharacterChanger.vue'
  import IconKeyChanger from '@config/components/events/IconKeyChanger/IconKeyChanger.vue'
  import RecordTabs from '@config/components/RecordTabs/RecordTabs.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import InformationCard from '@shared/components/parts/InformationCard.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import { staticSectionMap } from '../appItems/navigation/StaticSectionMap'

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'threshold' | 'limits' | 'scriptGame' | 'omikujiSet' | null
  const navigationStore = useNavigationStore()
  const { activeSection, selectedItemKey } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // sectionMeta のショートハンド
  const s = (key: string) => staticSectionMap.comments.find((i) => i.section === key)

  // Pinia store
  const { updateItem } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  // v-modelを使用したselectedCharacterの実装
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getItem('comments', selectedItemKey.value)
    },
    set: (value: CommentEventType) => {
      updateItem('comments', value.key, value)
    },
  })
</script>
