// src/configMaker/components/presets/useJsonServerLoader.ts (新規)
import { useJsonDataSource } from './useJsonDataSource';
import type { OmikujiDataType } from '@/types/';

/**
 * サーバーからのJSONファイルの読み込みを担当するComposable
 */
export const useJsonServerLoader = () => {
 const dataSource = useJsonDataSource();

 // サーバーからJSONを読み込み
 const loadJsonFromServer = async (url: string): Promise<OmikujiDataType | null> => {
  return await dataSource.loadFromServer(url);
 };

 // プリセットファイルの読み込み（例）
 const loadPresetTemplate = async (templateName: string): Promise<OmikujiDataType | null> => {
  const url = `/api/presets/${templateName}.json`;
  return await loadJsonFromServer(url);
 };

 return {
  // State
  isServerLoading: dataSource.isLoading,
  serverLoadError: dataSource.loadError,

  // Actions
  loadJsonFromServer,
  loadPresetTemplate,
  resetServerLoader: dataSource.resetDataSource
 };
};
