// src/composables/useTextEditor.ts
import { ref, watch, Ref } from 'vue'
import { WordPartySettings } from '@/types/OmikujiData/WordPartySettings'

export function useTextEditor(
  wordPartySettings: Ref<WordPartySettings[]>,
  updateSettings: (settings: WordPartySettings[]) => void
) {
  const textEditorContent = ref('')

  // 設定を編集しやすいテキスト形式に変換
  // 形式: "名前,パターン" (1行につき1つのname-patternペア)
  function settingsToTextFormat(settings: WordPartySettings[]): string {
    if (!Array.isArray(settings)) return ''

    return settings
      .map((setting) => {
        return `${setting.name},${setting.pattern}`
      })
      .join('\n')
  }

  // テキスト形式から設定に変換
  function textFormatToSettings(text: string): WordPartySettings[] {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0)
      .map((line, index) => {
        const commaIndex = line.indexOf(',')

        if (commaIndex === -1) {
          throw new Error(`行${index + 1}: カンマ区切りで "名前,パターン" の形式で入力してください`)
        }

        const name = line.substring(0, commaIndex).trim()
        const pattern = line.substring(commaIndex + 1).trim()

        if (!name) {
          throw new Error(`行${index + 1}: 名前が空です`)
        }

        if (!pattern) {
          throw new Error(`行${index + 1}: パターンが空です`)
        }

        return {
          name,
          pattern,
        }
      })
  }

  // 初期化時にテキストエディタに現在の設定を表示
  const initializeTextEditor = () => {
    const settings = Array.isArray(wordPartySettings.value) ? wordPartySettings.value : []
    textEditorContent.value = settingsToTextFormat(settings)
  }

  // wordPartySettingsが変更されたときにテキストエディタも更新
  watch(
    () => wordPartySettings.value,
    (newValue) => {
      const settings = Array.isArray(newValue) ? newValue : []
      textEditorContent.value = settingsToTextFormat(settings)
    },
    { deep: true }
  )

  // テキスト編集保存
  function saveTextEdit() {
    try {
      const validSettings = textFormatToSettings(textEditorContent.value)
      updateSettings(validSettings)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      alert(`保存エラー: ${message}`)
      throw error
    }
  }

  // テキスト編集リセット
  function resetTextEdit() {
    initializeTextEditor()
  }

  // 初期化
  initializeTextEditor()

  return {
    textEditorContent,
    saveTextEdit,
    resetTextEdit,
    settingsToTextFormat,
    textFormatToSettings,
  }
}
