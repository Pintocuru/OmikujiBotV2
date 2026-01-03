<!-- src\ConfigMaker\components\actionSets\ActionSetsEditor.vue -->
<template>
  <div class="flex justify-end gap-2">
    <CharacterChanger category="actionSets" />
  </div>
  <!-- タブ部分 -->
  <RecordTabs />

  <template v-if="selectedItem">
    <!-- 基本設定セクション -->
    <SectionCard
      icon="SlidersHorizontal"
      :isOpen="activeSection === 'baseSettings'"
      @toggle="toggleSection('baseSettings')"
      :title="selectedItem.name !== '' ? selectedItem.name : '名称未設定'"
      :description="selectedItem.description"
    >
      <BaseSettingsEditor v-model="selectedItem" category="actionSets" :isIsEnabled="false" :isAccessLevel="false" />
    </SectionCard>

    <!-- おみくじ設定セクション -->
    <SectionCard
      icon="ListChecks"
      :isOpen="activeSection === 'omikujiSet'"
      @toggle="toggleSection('omikujiSet')"
      title="おみくじ設定"
      description="コメントで実行するおみくじの設定"
    >
      <!-- おみくじ設定セクション -->
      <PostActionsEditor
        v-model="postActions"
        :gameScripts="selectedItem.gameScripts"
        category="actionSets"
        :selectedItemKey="selectedItemKey"
      />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ActionSetType } from '@/types/'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import BaseSettingsEditor from '@config/components/common/BaseSettingsEditor.vue'
  import PostActionsEditor from '@config/components/postAction/PostActionsEditor.vue'
  import CharacterChanger from '@config/components/rules/CharacterChanger/CharacterChanger.vue'
  import RecordTabs from '@config/components/RecordTabs/RecordTabs.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'

  // アクティブなセクションの管理
  type SectionType = 'baseSettings' | 'omikujiSet' | null
  const activeSection = ref<SectionType>('omikujiSet') // 初期状態で基本設定を開く

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
    set: (value: ActionSetType) => {
      omikujiStore.updateItem('actionSets', value.key, value)
    },
  })

  const postActions = computed({
    get: () => selectedItem.value?.postActions || [],
    set: (newActions) => {
      if (!selectedItem.value) return
      omikujiStore.updateItem('actionSets', selectedItem.value.key, {
        postActions: [...newActions],
      })
    },
  })
</script>
