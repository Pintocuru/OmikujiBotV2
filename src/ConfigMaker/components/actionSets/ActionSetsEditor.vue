<!-- src\ConfigMaker\components\actionSets\ActionSetsEditor.vue -->
<template>
  <div class="flex justify-end gap-2">
    <CharacterChanger category="actionSets" />
  </div>
  <!-- タブ部分 -->
  <RecordTabs />

  <div v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :title="selectedItem.name !== '' ? selectedItem.name : '名称未設定'"
      :subTitle="` : ${selectedItem.description ? selectedItem.description : ''}`"
      description="コメントルールの基本的な設定"
    >
      <BaseSettingsEditor v-model="selectedItem" category="actionSets" />
    </SectionCard>

    <!-- おみくじ設定セクション -->
    <SectionCard
      :isOpen="activeSection === 'omikujiSet'"
      @toggle="toggleSection('omikujiSet')"
      title="おみくじ設定"
      description="コメントで実行するおみくじの設定"
    >
      <PostActionsEditor v-model="selectedItem.postActions" category="actionSets" :selectedItemKey="selectedItemKey" />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { PostActionRecordType } from '@/types'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import BaseSettingsEditor from '@ConfigComponents/rules/BaseSettingsEditor.vue'
  import PostActionsEditor from '@ConfigComponents/postAction/PostActionsEditor.vue'
  import CharacterChanger from '@/ConfigMaker/components/rules/CharacterChanger/CharacterChanger.vue'
  import RecordTabs from '@ConfigComponents/RecordTabs/RecordTabs.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'omikujiSet' | null
  const activeSection = ref<SectionType>('baseSettings') // 初期状態で基本設定を開く

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    // 同じセクションをクリックした場合は閉じる、違うセクションの場合は切り替える
    activeSection.value = activeSection.value === section ? null : section
  }

  // Pinia store
  const omikujiStore = useOmikujiStore()
  const { data, selectedItemKey } = storeToRefs(omikujiStore)

  // v-modelを使用したselectedCharacterの実装
  const selectedItem = computed({
    get: () => {
      if (!selectedItemKey.value) return null
      return data.value.actionSets[selectedItemKey.value]
    },
    set: (value: PostActionRecordType) => {
      omikujiStore.updateItem('actionSets', value.key, value)
    },
  })
</script>
