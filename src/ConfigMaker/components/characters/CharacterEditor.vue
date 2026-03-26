<!-- src/ConfigMaker/components/characters/CharacterEditor.vue -->
<template>
  <!-- タブ -->
  <RecordTabs />

  <!-- 選択されたキャラクターの編集フォーム -->
  <template v-if="selectedItemKey && selectedItem">
    <!-- 基本情報 -->
    <SectionCard
      id="section-baseSettings"
      :icon="s('baseSettings')?.icon"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :title="s('baseSettings')?.label"
      :description="s('baseSettings')?.description"
    >
      <CharacterBasicInfo :selectedItemKey="selectedItemKey" />
    </SectionCard>

    <!-- フキダシカラー設定 -->
    <SectionCard
      id="section-colorSettings"
      :icon="s('colorSettings')?.icon"
      :isOpen="activeSection === 'colorSettings'"
      @toggle="toggleSection('colorSettings')"
      :title="s('colorSettings')?.label"
      :description="s('colorSettings')?.description"
    >
      <CharacterColorSettings :botName="selectedItem.displayName" :modelValue="selectedItem.color" />
    </SectionCard>

    <!-- BOTコメント表現設定 -->
    <SectionCard
      id="section-commentVoice"
      :icon="s('commentVoice')?.icon"
      :isOpen="activeSection === 'commentVoice'"
      @toggle="toggleSection('commentVoice')"
      :title="s('commentVoice')?.label"
      :description="s('commentVoice')?.description"
    >
      <CommentVoiceSettings
        :modelValue="selectedItem.displayOption"
        :backgroundColor="selectedItem.color.backgroundColor"
        :onUpdate="(value) => updateRecordProperty('characters', selectedItemKey!, 'displayOption', value)"
      />
    </SectionCard>

    <!-- ジェネレーター用画像設定 -->
    <SectionCard
      id="section-imageSettings"
      :icon="s('imageSettings')?.icon"
      :isOpen="activeSection === 'imageSettings'"
      @toggle="toggleSection('imageSettings')"
      :title="s('imageSettings')?.label"
      :description="s('imageSettings')?.description"
    >
      <CharacterImageSettings :modelValue="selectedItem.image" :selectedItemKey="selectedItemKey" />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import CharacterBasicInfo from './basicInfo/CharacterBasicInfo.vue'
  import CharacterColorSettings from './color/CharacterColorSettings.vue'
  import CharacterImageSettings from './CharacterImage/CharacterImageSettings.vue'
  import CommentVoiceSettings from './service/CommentVoiceSettings.vue'
  import RecordTabs from '@config/components/RecordTabs/RecordTabs.vue'
  import { useNavigationStore } from '@config/stores/useNavigationStore'
  import { useGetRecordData } from '@config/stores/useGetRecordData'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { staticSectionMap } from '../appItems/navigation/StaticSectionMap'

  const s = (key: string) => staticSectionMap.characters.find((i) => i.section === key)

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'colorSettings' | 'commentVoice' | 'serviceSettings' | 'imageSettings' | null
  const navigationStore = useNavigationStore()
  const { selectedItemKey, activeSection } = storeToRefs(navigationStore)

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const { getItem } = useGetRecordData()
  const { updateRecordProperty } = useOmikujiStore()

  // 選択されたキャラクターを取得（読み取り専用）
  const selectedItem = computed(() => {
    if (!selectedItemKey.value) return null
    return getItem('characters', selectedItemKey.value)
  })
</script>
