// src/configMaker/components/presets/useJsonDataSource.ts
// ! 使わないかも
import { ref } from 'vue'
import { OmikujiDataSchema, type OmikujiDataType } from '@/types/'

/**
 * JSON データの読み込み元を抽象化するComposable
 */
export const useJsonDataSource = () => {
  const isLoading = ref(false)
  const loadError = ref('')

  // JSONデータを検証・パースする共通メソッド
  const validateJsonData = async (jsonData: unknown): Promise<OmikujiDataType> => {
    try {
      // スキーマ検証
      return OmikujiDataSchema.parse(jsonData)
    } catch (error) {
      console.error('JSON validation error:', error)
      throw new Error('JSONデータの形式が正しくありません。')
    }
  }

  // ファイルからの読み込み
  const loadFromFile = async (file: File): Promise<OmikujiDataType | null> => {
    isLoading.value = true
    loadError.value = ''

    try {
      const text = await file.text()
      const jsonData = JSON.parse(text)
      return await validateJsonData(jsonData)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'ファイル読み込みエラーが発生しました'
      loadError.value = message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // サーバーからの読み込み
  const loadFromServer = async (url: string): Promise<OmikujiDataType | null> => {
    isLoading.value = true
    loadError.value = ''

    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`サーバーエラー: ${response.status} ${response.statusText}`)
      }

      const jsonData = await response.json()
      return await validateJsonData(jsonData)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'サーバーからの読み込みエラーが発生しました'
      loadError.value = message
      return null
    } finally {
      isLoading.value = false
    }
  }

  // リセット
  const resetDataSource = () => {
    loadError.value = ''
  }

  return {
    // State
    isLoading,
    loadError,

    // Actions
    loadFromFile,
    loadFromServer,
    resetDataSource,
  }
}
