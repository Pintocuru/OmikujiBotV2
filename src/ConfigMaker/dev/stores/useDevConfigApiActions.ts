// src/configMaker/dev/stores/useDevConfigApiActions.ts
import { devConfigApi } from '../services/apiService';
import { generateDateFileName } from '../services/devConfigUtils';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { toast } from 'vue-sonner';
import { DevConfigState } from './useDevConfigState';
import { OmikujiDataType } from '@/types/';

export function useDevConfigApiActions(state: DevConfigState) {
 // エラーハンドリング
 const handleApiError = (error: Error) => {
  console.error('API Error:', error);
  state.isServerConnected.value = false;
  const message = `${error.message}\n開発サーバーが起動していることを確認してください。`;

  toast.error('接続エラー', {
   description: message,
   duration: 5000
  });
 };

 // 非同期アクションのラッパー
 const handleAsyncAction = async <T>(
  action: () => Promise<T>,
  loadingKey: keyof DevConfigState
 ): Promise<T | null> => {
  const target = state[loadingKey];
  if (!('value' in target)) {
   throw new Error(`Invalid loading key: ${loadingKey}`);
  }

  target.value = true;
  try {
   return await action();
  } catch (error) {
   handleApiError(error as Error);
   return null;
  } finally {
   target.value = false;
  }
 };

 // ファイル一覧取得
 const fetchFileList = async () => {
  return await handleAsyncAction(async () => {
   const files = await devConfigApi.getFileList();
   state.availableFiles.value = files;
   state.isServerConnected.value = true;
   return files;
  }, 'isLoadingFileList');
 };

 // 日付ファイル名で保存
 const saveConfigAutoName = async () => {
  const fileName = generateDateFileName();
  await saveConfig(fileName);
 };

 // 名前指定で保存
 const saveConfig = async (fileName: string) => {
  const omikujiStore = useOmikujiStore();
  const trimmedFileName = fileName.trim();
  if (!trimmedFileName) return;

  return await handleAsyncAction(async () => {
   const configData = JSON.stringify(omikujiStore.data, null, 2);
   await devConfigApi.saveConfig(trimmedFileName, configData);
   await fetchFileList();

   toast.success('保存完了', {
    description: `設定を "${trimmedFileName}" として保存しました`,
    duration: 3000
   });

   state.isServerConnected.value = true;
   return null;
  }, 'isSaving');
 };

 // 上書き保存（確認toast付き）
 const overwriteConfig = async (fileName: string) => {
  const displayName = fileName.replace('.json', '');

  toast.warning('上書き確認', {
   description: `設定ファイル "${displayName}" を現在のデータで上書きしますか？`,
   duration: 10000,
   action: {
    label: '上書き',
    onClick: async () => {
     const omikujiStore = useOmikujiStore();

     return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data, null, 2);
      await devConfigApi.saveConfig(fileName, configData);
      await fetchFileList();

      toast.success('上書き完了', {
       description: `設定ファイル "${displayName}" を上書きしました`,
       duration: 3000
      });

      state.isServerConnected.value = true;
      return null;
     }, 'isSaving');
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

 // 上書き保存（確認toast付き）
 const overwriteOmikujiData = async () => {
  console.log('コンソールコメント');
  toast.warning('上書き確認', {
   description: `設定ファイル "omikujiData.js" を現在のデータで上書きしますか？`,
   duration: 10000,
   action: {
    label: '上書き',
    onClick: async () => {
     const omikujiStore = useOmikujiStore();

     return await handleAsyncAction(async () => {
      const configData = JSON.stringify(omikujiStore.data, null, 2);
      await devConfigApi.saveOmikujiData(configData);
      await fetchFileList();

      toast.success('上書き完了', {
       description: `設定ファイル "omikujiData.js" を上書きしました`,
       duration: 3000
      });

      state.isServerConnected.value = true;
      return null;
     }, 'isSaving');
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

 // 設定読み込み
 const loadConfig = async (fileName: string) => {
  const omikujiStore = useOmikujiStore();
  return await handleAsyncAction(async () => {
   const configData = await devConfigApi.loadConfig(fileName);
   omikujiStore.loadData(configData);

   toast.success('読み込み完了', {
    description: `設定 "${fileName.replace('.json', '')}" を読み込みました`,
    duration: 3000
   });

   state.isServerConnected.value = true;
   return configData;
  }, 'isLoading');
 };

 // 部分読み込み
 const loadPartialConfig = async (fileName: string, importData: OmikujiDataType) => {
  const omikujiStore = useOmikujiStore();
  return await handleAsyncAction(async () => {
   omikujiStore.loadData(importData);

   toast.success('部分読み込み完了', {
    description: `設定 "${fileName.replace('.json', '')}" を部分的に読み込みました`,
    duration: 3000
   });

   state.isServerConnected.value = true;
   return null;
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

 // ファイルデータ取得
 const fetchFileData = async (fileName: string) => {
  return await handleAsyncAction(async () => {
   const configData = await devConfigApi.loadConfig(fileName);
   state.isServerConnected.value = true;
   return configData;
  }, 'isLoading');
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
      handleApiError(error as Error);
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
  saveConfigAutoName,
  saveConfig,
  overwriteConfig,
  overwriteOmikujiData,
  loadConfig,
  loadPartialConfig,
  duplicateFile,
  renameFile,
  fetchFileData,
  deleteFile
 };
}
