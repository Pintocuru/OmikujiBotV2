// server/handlers/configHandler.ts
import * as fileSystem from '../services/fileSystemService'
import { RouteResult } from '../types'
import { validateFileName } from '../utils/validation'

/**
 * ファイル一覧を取得
 */
export async function listFiles(): Promise<RouteResult> {
  try {
    const files = await fileSystem.getFileList()
    return { code: 200, data: files }
  } catch (error) {
    console.error('List files error:', error)
    return { code: 500, data: { error: 'Failed to list files' } }
  }
}

/**
 * 設定ファイルを保存
 */
export async function saveConfig(fileName: string, data: string): Promise<RouteResult> {
  try {
    if (!fileName || !data) {
      return { code: 400, data: { error: 'fileName and data are required' } }
    }

    if (!validateFileName(fileName)) {
      return { code: 400, data: { error: 'Invalid file name' } }
    }

    await fileSystem.saveFile(fileName, data, false)
    console.info(`💾 Saved config file: ${fileName}`)
    return { code: 200, data: { message: 'File saved successfully', fileName } }
  } catch (error) {
    console.error('Save file error:', error)
    return { code: 500, data: { error: 'Failed to save file' } }
  }
}

/**
 * 設定ファイルを読み込み
 */
export async function loadConfig(fileName: string): Promise<RouteResult> {
  try {
    if (!fileName) {
      return { code: 400, data: { error: 'fileName is required' } }
    }

    if (!validateFileName(fileName)) {
      return { code: 400, data: { error: 'Invalid file name' } }
    }

    const data = await fileSystem.loadFile(fileName, false)
    console.info(`📖 Loaded config file: ${fileName}`)
    return { code: 200, data }
  } catch (error: any) {
    console.error('Load file error:', error)
    if (error.code === 'ENOENT') {
      return { code: 404, data: { error: 'File not found' } }
    }
    return { code: 500, data: { error: 'Failed to load file' } }
  }
}

/**
 * 設定ファイルを削除
 */
export async function deleteConfig(fileName: string): Promise<RouteResult> {
  try {
    if (!fileName) {
      return { code: 400, data: { error: 'fileName is required' } }
    }

    if (!validateFileName(fileName)) {
      return { code: 400, data: { error: 'Invalid file name' } }
    }

    await fileSystem.deleteFile(fileName)
    console.info(`🗑️ Deleted config file: ${fileName}`)
    return { code: 200, data: { message: 'File deleted successfully', fileName } }
  } catch (error: any) {
    console.error('Delete file error:', error)
    if (error.code === 'ENOENT') {
      return { code: 404, data: { error: 'File not found' } }
    }
    return { code: 500, data: { error: 'Failed to delete file' } }
  }
}
