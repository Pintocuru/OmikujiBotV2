<!-- src/ConfigMaker/components/characters/CharacterEditor.vue -->
<template>
  <!-- タブ -->
  <RecordTabs />

  <!-- 選択されたキャラクターの編集フォーム -->
  <template v-if="selectedItemKey && selectedItem">
    <!-- 基本情報 -->
    <SectionCard
      id="section-baseSettings"
      icon="SlidersHorizontal"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :title="selectedItem.name !== '' ? selectedItem.name : '名称未設定'"
      :description="selectedItem.description"
    >
      <CharacterBasicInfo :selectedItemKey="selectedItemKey" />
    </SectionCard>

    <!-- フキダシカラー設定 -->
    <SectionCard
      id="section-colorSettings"
      icon="Palette"
      :isOpen="activeSection === 'colorSettings'"
      @toggle="toggleSection('colorSettings')"
      title="フキダシカラー設定"
      description="フキダシのカラー編集を行います"
    >
      <CharacterColorSettings :botName="selectedItem.displayName" :modelValue="selectedItem.color" />
    </SectionCard>

    <!-- BOTコメント表現設定 -->
    <SectionCard
      id="section-commentVoice"
      icon="MessageSquare"
      :isOpen="activeSection === 'commentVoice'"
      @toggle="toggleSection('commentVoice')"
      title="BOTコメント表現設定"
      :subTitle="``"
      description="BOTコメントを読み上げる方法を指定します"
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
      icon="Image"
      :isOpen="activeSection === 'imageSettings'"
      @toggle="toggleSection('imageSettings')"
      title="ジェネレーター用画像設定"
      :subTitle="`画像数 : ${imageCount}`"
      description="ジェネレーターで表示する画像の設定"
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

  // 画像数カウント
  const imageCount = computed(() => {
    if (!selectedItem.value?.image) return 0

    return Object.values(selectedItem.value.image).filter((v) => {
      return v.some((s) => s.trim() !== '')
    }).length
  })
</script>
