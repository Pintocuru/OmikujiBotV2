// src/ConfigMaker/components/presetsExport/useConfigExport.ts
import { ref } from 'vue'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { generateJsContent, generateJsonContent } from './generateContent'
import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'

type ExportType = 'config' | 'template'

interface ExportConfig {
  filename: string
  contentType: string
  generateContent: (data: string) => string
  successMessage: {
    title: string
    description: string
  }
}

export const useConfigExport = () => {
  const omikujiStore = useOmikujiStore()
  const isExporting = ref(false)

  // エクスポート設定
  const exportConfigs: Record<ExportType, ExportConfig> = {
    config: {
      filename: 'omikujiData.js',
      contentType: 'application/javascript',
      generateContent: generateJsContent,
      successMessage: {
        title: '設定ファイルのダウンロード完了',
        description: 'omikujiData.js を同じフォルダに保存し、OBSを再起動してください。',
      },
    },
    template: {
      filename: 'omikuji-template.json',
      contentType: 'application/json',
      generateContent: generateJsonContent,
      successMessage: {
        title: 'テンプレートファイルのダウンロード完了',
        description: 'ダウンロードしたファイルを保存し、他のおみくじBOTでご利用ください。',
      },
    },
  }

  // ファイルダウンロード処理
  const downloadFile = (content: string, filename: string, contentType: string): boolean => {
    try {
      const blob = new Blob([content], { type: contentType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      return true
    } catch (error) {
      console.error('File download error:', error)
      return false
    }
  }

  // エクスポート処理
  const exportFile = async (type: ExportType): Promise<boolean> => {
    if (isExporting.value) return false

    try {
      isExporting.value = true
      const config = exportConfigs[type]

      // OmikujiDataをstringで持ってくる
      const configData = omikujiStore.exportData()
      if (!configData) {
        await swalModal.error({
          title: '設定データに問題があります',
          text: 'エラーを修正してから再度お試しください。',
        })
        return false
      }

      const content = config.generateContent(configData)
      const success = downloadFile(content, config.filename, config.contentType)

      if (success) {
        swalModal.success({
          title: config.successMessage.title,
          text: config.successMessage.description,
        })
      } else {
        await swalModal.error({
          title: `${type === 'config' ? '設定' : 'テンプレート'}ファイルのダウンロードに失敗しました`,
          text: 'もう一度お試しください。',
        })
      }

      return success
    } catch (error) {
      console.error(`${type} export error:`, error)
      await swalModal.error({
        title: `${type === 'config' ? '設定' : 'テンプレート'}ファイルの出力中にエラーが発生しました`,
        text: '詳細はコンソールをご確認ください。',
      })
      return false
    } finally {
      isExporting.value = false
    }
  }

  return {
    isExporting,
    exportFile,
  }
}
