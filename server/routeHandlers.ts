// server/routeHandlers.ts
import { Request, Response } from 'express';
import { SaveRequest, SaveOmikujiRequest } from './types.js';
import { getFileList, saveFile, saveOmikujiData, loadFile, deleteFile } from './fileService.js';

// ファイル一覧取得
export async function handleListFiles(req: Request, res: Response): Promise<void> {
 try {
  const files = await getFileList();
  res.json(files);
 } catch (error) {
  console.error('List files error:', error);
  res.status(500).json({ error: 'Failed to list files' });
 }
}

// ファイル保存
export async function handleSaveFile(
 req: Request<{}, {}, SaveRequest>,
 res: Response
): Promise<void> {
 try {
  const { fileName, data } = req.body;

  if (!fileName || !data) {
   res.status(400).json({ error: 'fileName and data are required' });
   return;
  }

  // ファイル名の検証
  if (!/^[\w\-. ]+\.json$/.test(fileName)) {
   res.status(400).json({ error: 'Invalid file name' });
   return;
  }

  await saveFile(fileName, data);
  console.log(`💾 Saved config file: ${fileName}`);
  res.json({ message: 'File saved successfully', fileName });
 } catch (error) {
  console.error('Save file error:', error);
  res.status(500).json({ error: 'Failed to save file' });
 }
}

// おみくじデータ保存
export async function handleSaveOmikuji(
 req: Request<{}, {}, { configData: string }>,
 res: Response
): Promise<void> {
 try {
  const { configData } = req.body;

  if (!configData) {
   res.status(400).json({ error: 'configData is required' });
   return;
  }

  await saveOmikujiData(configData);
  console.log('🎋 Saved omikuji data to assets/omikujiData.js');
  res.json({ message: 'Omikuji data saved successfully', filePath: 'assets/omikujiData.js' });
 } catch (error) {
  console.error('Save omikuji error:', error);
  res.status(500).json({ error: 'Failed to save omikuji data' });
 }
}

// ファイル読み込み
export async function handleLoadFile(req: Request, res: Response): Promise<void> {
 try {
  const { fileName } = req.params;

  // ファイル名の検証
  if (!/^[\w\-. ]+\.json$/.test(fileName)) {
   res.status(400).json({ error: 'Invalid file name' });
   return;
  }

  const data = await loadFile(fileName);
  console.log(`📖 Loaded config file: ${fileName}`);
  res.json(data);
 } catch (error: any) {
  console.error('Load file error:', error);
  if (error.code === 'ENOENT') {
   res.status(404).json({ error: 'File not found' });
  } else {
   res.status(500).json({ error: 'Failed to load file' });
  }
 }
}

// ファイル削除
export async function handleDeleteFile(req: Request, res: Response): Promise<void> {
 try {
  const { fileName } = req.params;

  // ファイル名の検証
  if (!/^[\w\-. ]+\.json$/.test(fileName)) {
   res.status(400).json({ error: 'Invalid file name' });
   return;
  }

  await deleteFile(fileName);
  console.log(`🗑️ Deleted config file: ${fileName}`);
  res.json({ message: 'File deleted successfully', fileName });
 } catch (error: any) {
  console.error('Delete file error:', error);
  if (error.code === 'ENOENT') {
   res.status(404).json({ error: 'File not found' });
  } else {
   res.status(500).json({ error: 'Failed to delete file' });
  }
 }
}

// ヘルスチェック
export function handleHealthCheck(req: Request, res: Response): void {
 res.json({ status: 'OK', message: 'Dev API server is running' });
}
