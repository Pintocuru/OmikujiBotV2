// src/configMaker/dev/stores/api/useLoadActions.ts
import { devConfigApi } from '../services/apiService';
import { useOmikujiStore } from '@ConfigStores/useOmikujiStore';
import { toast } from 'vue-sonner';
import { DevConfigState } from './useDevConfigState';
import { OmikujiDataType } from '@/types/';
import { useDevStore } from './useDevStore';

export function useLoadActions(
 state: DevConfigState,
 handleAsyncAction: (action: () => Promise<any>, loadingKey: keyof DevConfigState) => Promise<any>
) {
 // 設定読み込み
 const loadConfig = async (fileName: string) => {
  const omikujiStore = useOmikujiStore();
  const devStore = useDevStore();
  return await handleAsyncAction(async () => {
   const configData = await devConfigApi.loadConfig(fileName);
   omikujiStore.markAsChanged(); // 変更をマーク
   omikujiStore.loadData(configData);
   devStore.saveFileName = fileName;
   toast.success('読み込み完了', {
    description: `設定 "${fileName.replace('.json', '')}" を読み込みました`,
    duration: 3000
   });

   state.isServerConnected.value = true;
   return configData;
  }, 'isLoading');
 };

 // 部分読み込み（マージ対応）
 const loadPartialConfig = async (
  fileName: string,
  importData: OmikujiDataType,
  mode: 'replace' | 'merge' = 'replace'
 ) => {
  const omikujiStore = useOmikujiStore();
  return await handleAsyncAction(async () => {
   omikujiStore.loadData(importData);

   const modeText = mode === 'merge' ? 'マージ' : '部分読み込み';
   toast.success(`${modeText}完了`, {
    description: `設定 "${fileName.replace('.json', '')}" を${modeText}しました`,
    duration: 3000
   });

   state.isServerConnected.value = true;
   return null;
  }, 'isLoading');
 };

 return {
  loadConfig,
  loadPartialConfig
 };
}
