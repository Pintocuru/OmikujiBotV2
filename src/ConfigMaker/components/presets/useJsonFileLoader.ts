// src/configMaker/components/presets/useJsonFileLoader.ts
import { ref } from 'vue';
import type { OmikujiDataType } from '@type/';
import { useJsonDataSource } from './useJsonDataSource';

/**
 * ファイル選択によるJSONファイルの読み込みを担当するComposable
 */
export const useJsonFileLoader = () => {
 const fileInputRef = ref<HTMLInputElement | null>(null);
 const dataSource = useJsonDataSource();

 // ファイル選択をトリガー
 const openFileDialog = () => {
  fileInputRef.value?.click();
 };

 // ファイル選択ハンドラー
 const loadJsonFromFile = async (event: Event): Promise<OmikujiDataType | null> => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (!file) return null;

  const data = await dataSource.loadFromFile(file);

  // ファイル入力をリセット（同じファイルを再選択可能にする）
  target.value = '';

  return data;
 };

 return {
  // State
  fileInputRef,
  isFileLoading: dataSource.isLoading,
  fileLoadError: dataSource.loadError,

  // Actions
  openFileDialog,
  loadJsonFromFile,
  resetFileLoader: dataSource.resetDataSource
 };
};
