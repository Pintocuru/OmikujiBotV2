<!-- src/ConfigMaker/components/rulesMetas/MetaRuleEditor.vue -->
<template>
  <!-- 便利ボタン群 -->
  <div class="flex justify-end gap-2">
    <GlobalCharacterChanger category="metas" />
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
      <BaseSettingsEditor v-model="selectedItem" category="metas" />
    </SectionCard>

    <template v-if="selectedItem.isEnabled !== false">
      <!-- 条件設定セクション -->
      <SectionCard
        icon="Filter"
        :isOpen="activeSection === 'trigger'"
        @toggle="toggleSection('trigger')"
        title="発動条件設定"
        :subTitle="`発動条件: ${thresholdSubTitle}`"
        description="「おみくじを引く」発動条件の設定"
      >
        <CommentTriggerEditor v-model="selectedItem.trigger" :selectedItemKey="selectedItemKey" />
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
        <OmikujiSetEditor category="metas" :selectedItemKey="selectedItemKey" />
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
  import { serviceTriggerConditionMap } from '@/types/'
  import { ServiceEventType } from '@/types/OmikujiData/'
  import GlobalCharacterChanger from '../rules/CharacterChanger/CharacterChanger.vue'
  import CommentTriggerEditor from './MetaTriggerEditor.vue'
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
  type SectionType = 'baseSettings' | 'trigger' | 'omikujiSet' | null
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
      return getItem('metas', selectedItemKey.value)
    },
    set: (value: ServiceEventType) => {
      updateItem('metas', value.key, value)
    },
  })

  // 発動条件セクションのサブタイトル
  const thresholdSubTitle = computed(() => {
    if (!selectedItem.value) return ''
    const condition = selectedItem.value.trigger.condition
    return `[${serviceTriggerConditionMap[condition]}]`
  })
</script>
