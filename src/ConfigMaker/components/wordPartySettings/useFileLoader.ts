// src/composables/useFileLoader.ts
import { ref } from 'vue'
import { WordPartySettings } from '@/types/OmikujiData/RulesSchema'

export function useFileLoader(
  currentSettings: { value: WordPartySettings[] },
  updateSettings: (settings: WordPartySettings[]) => void
) {
  const loadStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null)

  // 正規表現の前後のメタ文字（^ や $、空白文字など）を除去するヘルパー関数
  function cleanPatternBoundaries(rawPattern: string): string {
    // 文字列の先頭にある '^' や空白文字、および文字列の末尾にある '$' や空白文字を除去
    return rawPattern.replace(/^[\^\s]+|[\$\s]+$/g, '')
  }

  // ファイル読み込み処理
  function handleFileLoad(content: string) {
    const tempLoadedSettings: { name: string; pattern: string[] | string }[] = []

    // WordParty の setup をハイジャック
    ;(window as any).WordParty = {
      init(config: any) {
        return {
          setup(setups: any[]) {
            tempLoadedSettings.push(
              ...setups.map((s) => ({
                name: s.name ?? '',
                pattern: s.pattern ?? [],
              }))
            )
            return { start() {} }
          },
        }
      },
    }

    try {
      new Function(content)() // eval 相当

      if (tempLoadedSettings.length > 0) {
        // string[]をstringに変換して即時適用
        const settings = [...currentSettings.value]

        tempLoadedSettings.forEach((loaded) => {
          const patterns = Array.isArray(loaded.pattern) ? loaded.pattern : [loaded.pattern]

          patterns.forEach((pattern) => {
            // 正規表現の前後のメタ文字と空白文字を除去
            const cleanedPattern = cleanPatternBoundaries(pattern)

            const existingIndex = settings.findIndex(
              (existing) => existing.name === loaded.name && existing.pattern === cleanedPattern
            )
            const newSetting: WordPartySettings = {
              name: loaded.name,
              pattern: cleanedPattern, // クリーンアップされたパターンを使用
            }

            if (existingIndex === -1) {
              // 新しい設定を追加（重複チェック）
              settings.push(newSetting)
            }
          })
        })

        // 設定を更新
        updateSettings(settings)

        loadStatus.value = {
          type: 'success',
          message: `${tempLoadedSettings.length}件の設定を読み込み、適用しました`,
        }
      } else {
        loadStatus.value = {
          type: 'error',
          message: '読み込めませんでした - 有効な設定が見つかりません',
        }
      }
    } catch (e) {
      loadStatus.value = {
        type: 'error',
        message: `読み込めませんでした - ${e}`,
      }
    }
  }

  return {
    loadStatus,
    handleFileLoad,
  }
}
