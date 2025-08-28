// src/composables/useFileLoader.ts
import { ref, Ref } from 'vue'
import { WordPartySettings } from '@/types/OmikujiData/WordPartySettings'

export function useFileLoader(
  currentSettings: Ref<WordPartySettings[]>,
  updateSettings: (settings: WordPartySettings[]) => void
) {
  const loadStatus = ref<{ type: 'success' | 'error'; message: string } | null>(null)

  // 正規表現の前後のメタ文字を除去するヘルパー関数
  function cleanPattern(rawPattern: string): string {
    return rawPattern.replace(/^[\^\s]+|[\$\s]+$/g, '')
  }

  // ファイル読み込み処理
  function handleFileLoad(content: string) {
    const loadedConfigs: any[] = []

    // WordPartyのセットアップをハイジャック
    const originalWordParty = (window as any).WordParty

    ;(window as any).WordParty = {
      init(config: any) {
        return {
          setup(setups: any[]) {
            loadedConfigs.push(...setups)
            return {
              start() {
                // 何もしない
              },
            }
          },
        }
      },
    }

    try {
      // JavaScriptコードを実行
      new Function(content)()

      if (loadedConfigs.length > 0) {
        // 既存設定を配列として取得
        const currentArray = Array.isArray(currentSettings.value) ? [...currentSettings.value] : []

        // 新しい設定を追加
        loadedConfigs.forEach((config) => {
          const name = config.name || ''
          const patterns = config.pattern || []

          // パターンが配列の場合、各パターンを個別のWordPartySettingsとして追加
          if (Array.isArray(patterns)) {
            patterns.forEach((pattern) => {
              const cleanedPattern = cleanPattern(pattern)
              if (cleanedPattern) {
                // 重複チェック
                const exists = currentArray.some(
                  (existing) => existing.name === name && existing.pattern === cleanedPattern
                )

                if (!exists) {
                  currentArray.push({
                    name: name,
                    pattern: cleanedPattern,
                  })
                }
              }
            })
          } else if (typeof patterns === 'string') {
            // パターンが文字列の場合
            const cleanedPattern = cleanPattern(patterns)
            if (cleanedPattern) {
              const exists = currentArray.some(
                (existing) => existing.name === name && existing.pattern === cleanedPattern
              )

              if (!exists) {
                currentArray.push({
                  name: name,
                  pattern: cleanedPattern,
                })
              }
            }
          }
        })

        // 設定を更新
        updateSettings(currentArray)

        loadStatus.value = {
          type: 'success',
          message: `${loadedConfigs.length}件の設定を読み込みました`,
        }
      } else {
        loadStatus.value = {
          type: 'error',
          message: '有効なWordParty設定が見つかりませんでした',
        }
      }
    } catch (error) {
      loadStatus.value = {
        type: 'error',
        message: `読み込みエラー: ${error instanceof Error ? error.message : String(error)}`,
      }
    } finally {
      // WordPartyオブジェクトを復元
      if (originalWordParty) {
        ;(window as any).WordParty = originalWordParty
      } else {
        delete (window as any).WordParty
      }
    }
  }

  return {
    loadStatus,
    handleFileLoad,
  }
}
