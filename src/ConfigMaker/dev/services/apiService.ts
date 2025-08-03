// src/configMaker/dev/services/apiService.ts
import type { FileItem } from '../devTypes';

export class DevConfigApiService {
 private readonly API_BASE = 'http://localhost:3001/api/dev-configs';

 async getFileList(): Promise<FileItem[]> {
  const response = await fetch(`${this.API_BASE}/list`);

  if (!response.ok) {
   throw new Error(`ファイル一覧の取得に失敗しました (${response.status})`);
  }

  const files = await response.json();
  return files.map((file: any) => ({
   name: file.name,
   displayName: file.name.replace('.json', ''),
   modified: file.modified
  }));
 }

 async saveConfig(fileName: string, configData: string): Promise<void> {
  const finalFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;

  const response = await fetch(`${this.API_BASE}/save`, {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json'
   },
   body: JSON.stringify({
    fileName: finalFileName,
    data: configData
   })
  });

  if (!response.ok) {
   throw new Error(`設定の保存に失敗しました (${response.status})`);
  }
 }

 async loadConfig(fileName: string): Promise<any> {
  const response = await fetch(`${this.API_BASE}/load/${fileName}`);

  if (!response.ok) {
   throw new Error(`設定の読み込みに失敗しました (${response.status})`);
  }

  return await response.json();
 }

 async deleteConfig(fileName: string): Promise<void> {
  const response = await fetch(`${this.API_BASE}/delete/${fileName}`, {
   method: 'DELETE'
  });

  if (!response.ok) {
   throw new Error(`設定ファイルの削除に失敗しました (${response.status})`);
  }
 }

 async saveOmikujiData(configData: string): Promise<void> {
  const response = await fetch(`${this.API_BASE}/save-omikuji`, {
   method: 'POST',
   headers: {
    'Content-Type': 'application/json'
   },
   body: JSON.stringify({ configData })
  });

  if (!response.ok) {
   throw new Error(`おみくじデータの保存に失敗しました (${response.status})`);
  }

  return await response.json();
 }
}

export const devConfigApi = new DevConfigApiService();
