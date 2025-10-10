<!-- src/configMaker/components/characters/CharacterEditor.vue -->
<template>
  <!-- タブ -->
  <RecordTabs />

  <!-- 選択されたキャラクターの編集フォーム -->
  <div v-if="selectedItemKey && selectedItem">
    <!-- 基本情報 -->
    <SectionCard
      :isOpen="activeSection === 'basicInfo'"
      @toggle="toggleSection('basicInfo')"
      :title="selectedItem.name !== '' ? selectedItem.name : '名称未設定'"
      :subTitle="` : ${selectedItem.description ? selectedItem.description : ''}`"
      description="キャラクター、またはカラー設定名の編集"
    >
      <CharacterBasicInfo :selectedItemKey="selectedItemKey" />
    </SectionCard>

    <!-- フキダシカラー設定 -->
    <SectionCard
      :isOpen="activeSection === 'colorSettings'"
      @toggle="toggleSection('colorSettings')"
      title="フキダシカラー設定"
      description="フキダシのカラー編集を行います"
    >
      <CharacterColorSettings :modelValue="selectedItem.color" />
    </SectionCard>

    <!-- キャラクター表示設定 -->
    <SectionCard
      :isOpen="activeSection === 'displaySettings'"
      @toggle="toggleSection('displaySettings')"
      title="キャラクター表示設定"
      :subTitle="`(キャラ画像表示:${selectedItem.displayOption.isIconDisplay ? 'ON' : 'OFF'}${selectedItem.displayOption.isOneCommePost ? ',わんコメ投稿' : selectedItem.displayOption.isVoice ? ',ボイス読み上げ' : ''})`"
      description="キャラクターアイコン(画像)に関する編集を行います"
    >
      <CharacterIconDisplaySettings :modelValue="selectedItem.displayOption" />
    </SectionCard>

    <!-- キャラクター用枠設定 -->
    <SectionCard
      v-if="selectedItem.displayOption?.isOneCommePost"
      :isOpen="activeSection === 'serviceSettings'"
      @toggle="toggleSection('serviceSettings')"
      title="キャラクター用枠設定"
      :subTitle="` わんコメ投稿用画像 : ${selectedItem.imageBase64 ? 'あり' : 'なし'}`"
      description="わんコメの投稿で必要な設定を行います"
    >
      <CharacterServiceSettings :selectedItemKey="selectedItemKey" />
    </SectionCard>

    <!-- ジェネレーター用画像設定 -->
    <SectionCard
      v-if="selectedItem.displayOption?.isIconDisplay"
      :isOpen="activeSection === 'imageSettings'"
      @toggle="toggleSection('imageSettings')"
      title="ジェネレーター用画像設定"
      :subTitle="`画像数 : ${imageCount}`"
      description="ジェネレーターで表示する画像の設定"
    >
      <CharacterImageSettings :modelValue="selectedItem.image" :selectedItemKey="selectedItemKey" />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue'
  import CharacterBasicInfo from './CharacterBasicInfo.vue'
  import CharacterColorSettings from './CharacterColorSettings.vue'
  import CharacterImageSettings from './CharacterImageSettings.vue'
  import CharacterServiceSettings from './CharacterServiceSettings.vue'
  import CharacterIconDisplaySettings from './CharacterIconDisplaySettings.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'

  // アクティブなセクションの管理
  type SectionType = 'basicInfo' | 'colorSettings' | 'displaySettings' | 'serviceSettings' | 'imageSettings' | null
  const activeSection = ref<SectionType>('basicInfo') // 初期状態で基本情報を開く

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { data, selectedItemKey } = storeToRefs(omikujiStore)

  // 選択されたキャラクターを取得（読み取り専用）
  const selectedItem = computed(() => {
    if (!selectedItemKey.value) return null
    return data.value.characters[selectedItemKey.value]
  })

  // 画像数カウント
  const imageCount = computed(() => {
    if (!selectedItem.value?.image) return 0
    return Object.values(selectedItem.value.image).filter((v) => v && v.trim() !== '').length
  })
</script>
