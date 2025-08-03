// src/configMaker/dev/stores/api/useFileActions.ts
import { devConfigApi } from '../services/apiService';
import { toast } from 'vue-sonner';
import { DevConfigState } from './useDevConfigState';

export function useFileActions(
 state: DevConfigState,
 handleAsyncAction: (action: () => Promise<any>, loadingKey: keyof DevConfigState) => Promise<any>
) {
 // ファイル一覧取得
 const fetchFileList = async () => {
  return await handleAsyncAction(async () => {
   const files = await devConfigApi.getFileList();
   state.availableFiles.value = files;
   state.isServerConnected.value = true;
   return files;
  }, 'isLoadingFileList');
 };

 // ファイルデータ取得
 const fetchFileData = async (fileName: string) => {
  return await handleAsyncAction(async () => {
   const configData = await devConfigApi.loadConfig(fileName);
   state.isServerConnected.value = true;
   return configData;
  }, 'isLoading');
 };

 // ファイル複製
 const duplicateFile = async (fileName: string) => {
  return await handleAsyncAction(async () => {
   const configData = await devConfigApi.loadConfig(fileName);
   const originalName = fileName.replace('.json', '');
   const duplicateName = `${originalName}_copy_${Date.now()}`;

   await devConfigApi.saveConfig(duplicateName, JSON.stringify(configData, null, 2));
   await fetchFileList();

   toast.success('複製完了', {
    description: `設定ファイル "${originalName}" を複製しました`,
    duration: 3000
   });

   state.isServerConnected.value = true;
   return null;
  }, 'isSaving');
 };

 // ファイル名変更
 const renameFile = async (oldFileName: string, newFileName: string) => {
  return await handleAsyncAction(async () => {
   const configData = await devConfigApi.loadConfig(oldFileName);
   await devConfigApi.saveConfig(newFileName, JSON.stringify(configData, null, 2));
   await devConfigApi.deleteConfig(oldFileName);

   const file = state.availableFiles.value.find((f: any) => f.name === oldFileName);
   if (file) {
    file.name = newFileName;
   }
   await fetchFileList();

   toast.success('名前変更完了', {
    description: `設定ファイル名を "${oldFileName.replace('.json', '')}" から "${newFileName}" に変更しました`,
    duration: 3000
   });

   state.isServerConnected.value = true;
   return null;
  }, 'isSaving');
 };

 // ファイル削除（確認toast付き）
 const deleteFile = async (fileName: string) => {
  const displayName = fileName.replace('.json', '');

  toast.warning('削除確認', {
   description: `設定ファイル "${displayName}" を削除しますか？`,
   duration: 10000,
   action: {
    label: '削除',
    onClick: async () => {
     state.isDeletingFileMap.set(fileName, true);

     try {
      await devConfigApi.deleteConfig(fileName);
      const index = state.availableFiles.value.findIndex((f: any) => f.name === fileName);
      if (index >= 0) {
       state.availableFiles.value.splice(index, 1);
      }

      toast.success('削除完了', {
       description: `設定ファイル "${displayName}" を削除しました`,
       duration: 3000
      });

      state.isServerConnected.value = true;
     } catch (error) {
      // エラーハンドリングは親のhandleApiErrorを使用
      console.error('API Error:', error);
      state.isServerConnected.value = false;
      const message = `${(error as Error).message}\n開発サーバーが起動していることを確認してください。`;

      toast.error('接続エラー', {
       description: message,
       duration: 5000
      });
     } finally {
      state.isDeletingFileMap.delete(fileName);
     }
    }
   },
   cancel: {
    label: 'キャンセル',
    onClick: () => {
     toast.dismiss();
    }
   }
  });
 };

 return {
  fetchFileList,
  fetchFileData,
  duplicateFile,
  renameFile,
  deleteFile
 };
}
