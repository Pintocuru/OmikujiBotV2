<!-- src/configMaker/components/wordPartySettings/WordPartySettingsEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- WordParty発火リスト -->
    <SectionCard
      :isOpen="activeSection === 'fireList'"
      @toggle="toggleSection('fireList')"
      title="WordParty発動リスト"
      :sub-title="` ( ${wordPartySettings.length}件)`"
      description="デフォルトでは、「おみくじBOT用 word-party」のデータが入っています"
    >
      <FireList :settings="wordPartySettings" />
    </SectionCard>

    <!-- テキストエディタ -->
    <SectionCard
      :isOpen="activeSection === 'textEditor'"
      @toggle="toggleSection('textEditor')"
      title="テキスト編集"
      description="あらかじめデータは入れてますが、手動入力も可能です"
    >
      <TextEditor
        v-model="textEditorContent"
        :settings="wordPartySettings"
        @save="saveTextEdit"
        @reset="resetTextEdit"
      />
    </SectionCard>

    <!-- config.js 読み込み機能 -->
    <SectionCard
      v-if="useVisibilityAccess().canShow('wordPartyLoading')"
      :isOpen="activeSection === 'developerMode'"
      @toggle="toggleSection('developerMode')"
      :variant="developerModeAgreed ? 'success' : 'outline-success'"
      title="WordParty config.js読み込み機能"
      description="config.jsファイルを読み込み、上記のリストに追加します"
    >
      <DeveloperMode
        :agreed="developerModeAgreed"
        :load-status="loadStatus"
        @agree="developerModeAgreed = true"
        @load="handleFileLoad"
      />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { WordPartySettings } from '@/types/OmikujiData/WordPartySettings'
  import { useTextEditor } from './useTextEditor'
  import { useFileLoader } from './useFileLoader'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import TextEditor from '@ConfigComponents/wordPartySettings/TextEditor.vue'
  import FireList from '@ConfigComponents/wordPartySettings/FireList.vue'
  import DeveloperMode from '@ConfigComponents/wordPartySettings/DeveloperMode.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { storeToRefs } from 'pinia'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'

  // アクティブなセクションの管理
  type SectionType = 'fireList' | 'textEditor' | 'developerMode' | null
  const activeSection = ref<SectionType>('fireList') // 初期状態で発火リストを開く

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // 設定管理
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // WordParty設定の参照 (computed with get/set)
  const wordPartySettings = computed({
    get: (): WordPartySettings[] => {
      const settings = data.value.wordPartySettings
      return Array.isArray(settings) ? settings : []
    },
    set: (newValue: WordPartySettings[]) => {
      if (!Array.isArray(newValue)) return
      omikujiStore.updateWordPartySettings(newValue)
    },
  })

  // 読み込み機能
  const developerModeAgreed = ref(false)

  // 設定更新関数
  const updateSettings = (newSettings: WordPartySettings[]) => {
    wordPartySettings.value = newSettings
  }

  // テキストエディタ機能
  const { textEditorContent, saveTextEdit, resetTextEdit } = useTextEditor(wordPartySettings, updateSettings)

  // ファイル読み込み機能
  const { loadStatus, handleFileLoad } = useFileLoader(wordPartySettings, updateSettings)
</script>
