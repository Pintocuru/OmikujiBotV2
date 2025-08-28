<!-- src/configMaker/components/wordPartySettings/WordPartySettingsEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- WordParty発火リスト -->
    <FireList :settings="wordPartySettings" />

    <!-- テキストエディタ -->
    <TextEditor v-model="textEditorContent" :settings="wordPartySettings" @save="saveTextEdit" @reset="resetTextEdit" />

    <!-- config.js 読み込み機能 -->
    <DeveloperMode
      v-if="useVisibilityAccess().canShow('wordPartyLoading')"
      :agreed="developerModeAgreed"
      :load-status="loadStatus"
      @agree="developerModeAgreed = true"
      @load="handleFileLoad"
    />
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
  import { storeToRefs } from 'pinia'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'

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
      if (!Array.isArray(newValue)) {
        console.warn('WordPartySettings must be an array')
        return
      }

      // updateWordPartySettingsメソッドに配列を渡す
      // 元のコードでは spread演算子を使っていたが、直接配列を渡すように修正
      omikujiStore.data.wordPartySettings = newValue
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
