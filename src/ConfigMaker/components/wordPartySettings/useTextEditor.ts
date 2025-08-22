// src/composables/useTextEditor.ts
import { ref, watch } from 'vue'
import { WordPartySettings } from '@/types/OmikujiData/WordPartySettings'

export function useTextEditor(
  wordPartySettings: { value: WordPartySettings[] },
  updateSettings: (settings: WordPartySettings[]) => void
) {
  const textEditorContent = ref('')

  // 設定を簡潔な形式に変換
  function settingsToSimpleFormat(settings: WordPartySettings[]): string {
    return settings.map((item) => `${item.name},${item.pattern}`).join('\n')
  }

  // 簡潔な形式から設定に変換
  function simpleFormatToSettings(text: string): WordPartySettings[] {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line) => {
        const commaIndex = line.indexOf(',')
        if (commaIndex === -1) return null
        return {
          name: line.substring(0, commaIndex).trim(),
          pattern: line.substring(commaIndex + 1).trim(),
        }
      })
      .filter((item) => item !== null) as WordPartySettings[]
  }

  // 初期化時にテキストエディタに現在の設定を表示
  textEditorContent.value = settingsToSimpleFormat(wordPartySettings.value)

  // wordPartySettingが変更されたときにテキストエディタも更新
  watch(
    () => wordPartySettings.value,
    (newValue) => {
      textEditorContent.value = settingsToSimpleFormat(newValue)
    },
    { deep: true }
  )

  // テキスト編集保存
  function saveTextEdit() {
    try {
      const validSettings = simpleFormatToSettings(textEditorContent.value)
      updateSettings(validSettings)
    } catch (e) {
      alert('形式が正しくありません: ' + e)
    }
  }

  // テキスト編集リセット
  function resetTextEdit() {
    textEditorContent.value = settingsToSimpleFormat(wordPartySettings.value)
  }

  return {
    textEditorContent,
    saveTextEdit,
    resetTextEdit,
    settingsToSimpleFormat,
    simpleFormatToSettings,
  }
}
