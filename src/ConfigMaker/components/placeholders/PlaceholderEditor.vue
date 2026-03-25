<!-- src/ConfigMaker/components/placeholders/PlaceholderEditor.vue -->
<template>
  <!-- タブ部分 -->
  <RecordTabs />

  <template v-if="selectedItem">
    <!-- 基本設定 -->
    <SectionCard
      id="section-baseSettings"
      icon="SlidersHorizontal"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :title="selectedItem.name !== '' ? selectedItem.name : '名称未設定'"
      :description="selectedItem.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="placeholders" :isIsEnabled="false" :isAccessLevel="false" />
    </SectionCard>

    <!-- プレースホルダー設定 -->
    <SectionCard
      id="section-placeholder"
      icon="Brackets"
      :isOpen="activeSection === 'placeholder'"
      @toggle="toggleSection('placeholder')"
      title="プレースホルダー設定"
      :subTitle="`(プレースホルダー数:${selectedItem.values.length}, 総重量:${totalWeight})`"
      description="抽選するプレースホルダーを編集します"
    >
      <PlaceholderValuesEditor :key="selectedItem.id" :placeholderKey="selectedItem.key" />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue'
  import BaseSettingsEditor from '@config/components/common/BaseSettingsEditor.vue'
  import RecordTabs from '@config/components/RecordTabs/RecordTabs.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'placeholder' | null
  const navigationStore = useNavigationStore()
  const { selectedItemKey, activeSection } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const { updateItem } = useOmikujiStore()
  const { getItem } = useGetRecordData()

  // 選択されたアイテムの取得（読み取り専用）
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return getItem('placeholders', selectedItemKey.value)
    },
    set: (value) => {
      if (!selectedItemKey.value || !value) return
      updateItem('placeholders', selectedItemKey.value, value)
    },
  })

  // 総重量を計算するcomputed
  const totalWeight = computed(() => {
    if (!selectedItem.value) return 0
    return selectedItem.value.values.reduce((sum, v) => {
      if (typeof v === 'string') return sum
      return sum + (v.weight ?? 0)
    }, 0)
  })
</script>
