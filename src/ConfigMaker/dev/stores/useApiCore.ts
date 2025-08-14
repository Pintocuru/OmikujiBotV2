// src/configMaker/dev/stores/api/useApiCore.ts
import { toast } from 'vue-sonner';
import { DevConfigStateType } from '../devTypes';

export function useApiCore(state: DevConfigStateType) {
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
  loadingKey: keyof DevConfigStateType
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

 return {
  handleApiError,
  handleAsyncAction
 };
}
