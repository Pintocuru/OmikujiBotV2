// src/configMaker/components/presets/useConfigExport.ts
import { ref } from 'vue';
import { useOmikujiStore } from '@ConfigStore/useOmikujiStore';
import { toast } from 'vue-sonner';
import { generateJsContent, generateJsonContent } from './generateContent';

export type ExportType = 'config' | 'template';

interface ExportConfig {
 filename: string;
 contentType: string;
 generateContent: (data: string) => string;
 successMessage: {
  title: string;
  description: string;
 };
}

export const useConfigExport = () => {
 const omikujiStore = useOmikujiStore();
 const isExporting = ref(false);

 // エクスポート設定
 const exportConfigs: Record<ExportType, ExportConfig> = {
  config: {
   filename: 'omikujiData.js',
   contentType: 'application/javascript',
   generateContent: generateJsContent,
   successMessage: {
    title: '設定ファイルのダウンロード完了',
    description: 'omikujiData.js を同じフォルダに保存し、OBSを再起動してください。'
   }
  },
  template: {
   filename: 'omikuji-template.json',
   contentType: 'application/json',
   generateContent: generateJsonContent,
   successMessage: {
    title: 'テンプレートファイルのダウンロード完了',
    description: 'ダウンロードしたファイルを保存し、他のプロジェクトでご利用ください。'
   }
  }
 };

 // ファイルダウンロード処理
 const downloadFile = (content: string, filename: string, contentType: string): boolean => {
  try {
   const blob = new Blob([content], { type: contentType });
   const url = URL.createObjectURL(blob);
   const link = document.createElement('a');

   link.href = url;
   link.download = filename;
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);

   URL.revokeObjectURL(url);
   return true;
  } catch (error) {
   console.error('File download error:', error);
   return false;
  }
 };

 // エクスポート処理
 const exportFile = async (type: ExportType): Promise<boolean> => {
  if (isExporting.value) return false;

  try {
   isExporting.value = true;
   const config = exportConfigs[type];

   // バリデーションチェック
   const validation = omikujiStore.validateData();
   if (!validation.success) {
    toast.error('設定データに問題があります。エラーを修正してから再度お試しください。');
    return false;
   }

   // OmikujiDataをstringで持ってくる
   const configData = omikujiStore.exportData();
   const content = config.generateContent(configData);
   const success = downloadFile(content, config.filename, config.contentType);

   if (success) {
    toast.info(config.successMessage.title, {
     duration: 15000,
     description: config.successMessage.description
    });
   } else {
    toast.error(
     `${type === 'config' ? '設定' : 'テンプレート'}ファイルのダウンロードに失敗しました。`
    );
   }

   return success;
  } catch (error) {
   console.error(`${type} export error:`, error);
   toast.error(
    `${type === 'config' ? '設定' : 'テンプレート'}ファイルの出力中にエラーが発生しました。`
   );
   return false;
  } finally {
   isExporting.value = false;
  }
 };

 return {
  isExporting,
  exportFile
 };
};
