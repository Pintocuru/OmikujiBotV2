<!-- src\ConfigMaker\components\characters\CharacterEditor.vue -->
<template>
  <!-- タブ -->
  <RecordTabs />

  <!-- 選択されたキャラクターの編集フォーム -->
  <template v-if="selectedItemKey && selectedItem">
    <!-- 基本情報 -->
    <SectionCard
      icon="SlidersHorizontal"
      :isOpen="activeSection === 'basicInfo'"
      @toggle="toggleSection('basicInfo')"
      :title="selectedItem.name !== '' ? selectedItem.name : '名称未設定'"
      :description="selectedItem.description"
    >
      <CharacterBasicInfo :selectedItemKey="selectedItemKey" />
    </SectionCard>

    <!-- フキダシカラー設定 -->
    <SectionCard
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
      icon="MessageSquare"
      :isOpen="activeSection === 'botComments'"
      @toggle="toggleSection('botComments')"
      title="BOTコメント表現設定"
      :subTitle="``"
      description="BOTコメントを読み上げる方法を指定します"
    >
      <CharacterIconDisplaySettings :modelValue="selectedItem.displayOption as any" />
    </SectionCard>

    <!-- ジェネレーター用画像設定 -->
    <SectionCard
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
  import { computed, ref } from 'vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue'
  import CharacterBasicInfo from './basicInfo/CharacterBasicInfo.vue'
  import CharacterColorSettings from './color/CharacterColorSettings.vue'
  import CharacterImageSettings from './CharacterImage/CharacterImageSettings.vue'
  import CharacterIconDisplaySettings from './service/CharacterIconDisplaySettings.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'

  // アクティブなセクションの管理
  type SectionType = 'basicInfo' | 'colorSettings' | 'botComments' | 'serviceSettings' | 'imageSettings' | null
  const activeSection = ref<SectionType>('colorSettings') // 初期状態で基本情報を開く

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

    return Object.values(selectedItem.value.image).filter((v) => {
      return v.some((s) => s.trim() !== '')
    }).length
  })
</script>
