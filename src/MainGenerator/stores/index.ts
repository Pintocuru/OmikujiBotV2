// src/stores/index.ts
export { useAppStore } from './useAppStore';
export { useMessageStore } from './useMessageStore';
export { useDisplayStore } from './useDisplayStore';

// メインのcomposedストア（従来のcomposablesと互換性を保つため）
import { useAppStore } from './useAppStore';
import { useMessageStore } from './useMessageStore';
import { useDisplayStore } from './useDisplayStore';

export const useMainStore = () => {
 const appStore = useAppStore();
 const messageStore = useMessageStore();
 const displayStore = useDisplayStore();

 return {
  // App関連
  ...appStore,
  // Message関連
  ...messageStore,
  // Display関連
  ...displayStore
 };
};
