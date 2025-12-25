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
      <CharacterBasicInfo :selectedItemKey="selectedItemKey" class="space-y-2" />
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

    <!-- BOTコメント表現設定 -->
    <SectionCard
      :isOpen="activeSection === 'displaySettings'"
      @toggle="toggleSection('displaySettings')"
      title="BOTコメント表現設定"
      :subTitle="``"
      description="BOTコメントを読み上げる方法を指定します"
    >
      <CharacterIconDisplaySettings :modelValue="selectedItem.displayOption as any" />
    </SectionCard>

    <!-- ジェネレーター用画像設定 -->
    <SectionCard
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
  import CharacterBasicInfo from './basicInfo/CharacterBasicInfo.vue'
  import CharacterColorSettings from './color/CharacterColorSettings.vue'
  import CharacterImageSettings from './CharacterImage/CharacterImageSettings.vue'
  import CharacterIconDisplaySettings from './service/CharacterIconDisplaySettings.vue'
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

    return Object.values(selectedItem.value.image).filter((v) => {
      return v.some((s) => s.trim() !== '')
    }).length
  })
</script>
