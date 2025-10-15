<!-- src/configMaker/components/placeholders/PlaceholderEditor.vue -->
<template>
  <!-- タブ部分 -->
  <RecordTabs />

  <div v-if="selectedItem">
    <!-- 基本設定 -->
    <SectionCard
      :isOpen="activeSection === 'basic'"
      @toggle="toggleSection('basic')"
      :title="selectedItem.name !== '' ? selectedItem.name : '名称未設定'"
      description="プレースホルダー名の設定を行います"
    >
      <BaseSettingsEditor v-model="selectedItem" category="placeholders" :isIsEnabled="false" :isAccessLevel="false" />
    </SectionCard>

    <!-- プレースホルダー設定 -->
    <SectionCard
      :isOpen="activeSection === 'placeholder'"
      @toggle="toggleSection('placeholder')"
      title="プレースホルダー設定"
      :subTitle="`(プレースホルダー数:${selectedItem.values.length}, 総重量:${totalWeight})`"
      description="抽選するプレースホルダーを編集します"
    >
      <PlaceholderValuesEditor :key="selectedItem.id" :placeholderKey="selectedItem.key" />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { PlaceholderType } from '@/types'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import PlaceholderValuesEditor from './PlaceholderValuesEditor.vue'
  import BaseSettingsEditor from '@ConfigComponents/common/BaseSettingsEditor.vue'
  import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue'
  import CopyButton from '@ConfigComponents/parts/CopyButton.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'

  // アクティブなセクションの管理
  type SectionType = 'basic' | 'placeholder' | null
  const activeSection = ref<SectionType>('basic') // 初期状態で基本設定を開く

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    // 同じセクションをクリックした場合は閉じる、違うセクションの場合は切り替える
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { data, selectedItemKey } = storeToRefs(omikujiStore)

  // 選択されたアイテムの取得（読み取り専用）
  const selectedItem = computed(() => {
    if (!selectedItemKey.value) return null
    return data.value.placeholders[selectedItemKey.value]
  })

  // 総重量を計算するcomputed
  const totalWeight = computed(() => {
    if (!selectedItem.value) return 0
    return selectedItem.value.values.reduce((sum, v) => {
      if (typeof v === 'string') return sum
      return sum + (v.weight ?? 0)
    }, 0)
  })

  // プレースホルダーのプロパティ用computedを生成するヘルパー関数
  const createPlaceholderProperty = <T,>(key: keyof PlaceholderType) => {
    return computed({
      get: () => {
        if (!selectedItem.value) return '' as T
        return selectedItem.value[key] as T
      },
      set: (value: T) => {
        if (!selectedItem.value) return
        const updatedItem = {
          ...selectedItem.value,
          [key]: value,
        }
        omikujiStore.updateItem('placeholders', selectedItem.value.key, updatedItem)
      },
    })
  }

  // 各プロパティのcomputed
  const itemName = createPlaceholderProperty<string>('name')
</script>
