<!-- src/configMaker/components/wordPartySettings/WordPartySettingsEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- テキストエディタ -->
    <TextEditor v-model="textEditorContent" :settings="wordPartySettings" @save="saveTextEdit" @reset="resetTextEdit" />

    <!-- WordParty発火リスト -->
    <FireList :settings="wordPartySettings" />

    <!-- config.js 読み込み機能 -->
    <DeveloperMode
      v-if="godModeEnabled"
      :agreed="developerModeAgreed"
      :load-status="loadStatus"
      @agree="developerModeAgreed = true"
      @load="handleFileLoad"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { WordPartySettings } from '@/types/OmikujiData/RulesSchema'
  import { useTextEditor } from './useTextEditor'
  import { useFileLoader } from './useFileLoader'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import TextEditor from '@ConfigComponents/wordPartySettings/TextEditor.vue'
  import FireList from '@ConfigComponents/wordPartySettings/FireList.vue'
  import DeveloperMode from '@ConfigComponents/wordPartySettings/DeveloperMode.vue'

  // 設定管理
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // WordParty設定の参照 (computed with get/set)
  const wordPartySettings = computed({
    get: () => data.value.wordPartySettings,
    set: (newValue: WordPartySettings[]) => {
      omikujiStore.updateWordPartySettings({
        ...data.value.wordPartySettings,
        ...newValue,
      })
    },
  })

  // GODモードの有効状態
  const godModeEnabled = computed(() => data.value.displaySettings.developer.godModeEnabled)
  // 開発者モード機能
  const developerModeAgreed = ref(false)

  // 設定更新関数
  const updateSettings = (data: WordPartySettings[]) => (wordPartySettings.value = data)

  // テキストエディタ機能
  const { textEditorContent, saveTextEdit, resetTextEdit } = useTextEditor(wordPartySettings, updateSettings)

  // ファイル読み込み機能
  const { loadStatus, handleFileLoad } = useFileLoader(wordPartySettings, updateSettings)
</script>
