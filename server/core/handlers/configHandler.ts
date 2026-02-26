// server/core/handlers/configHandler.ts
import { RouteResult } from '../types'
import * as fileSystem from '../services/fileSystemService'
import { validateFileName } from '../utils/validation'

const PRESET_DIR_NAME = 'presets'

/**
 * ファイル一覧を取得
 */
export async function listFiles(): Promise<RouteResult> {
  try {
    const files = await fileSystem.getFileList(PRESET_DIR_NAME)
    return { code: 200, data: files }
  } catch (error) {
    console.error('List files error:', error)
    return { code: 500, data: { error: 'Failed to list files' } }
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

    const data = await fileSystem.loadFile(PRESET_DIR_NAME, fileName)
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
 * 設定ファイルを移動
 */
export async function moveConfig(fromName: string, toName: string): Promise<RouteResult> {
  try {
    if (!fromName || !toName) {
      return { code: 400, data: { error: 'fromName and toName are required' } }
    }
    if (!validateFileName(fromName) || !validateFileName(toName)) {
      return { code: 400, data: { error: 'Invalid file name' } }
    }

    await fileSystem.moveFile(PRESET_DIR_NAME, fromName, toName)

    // 移動元のフォルダが空になったら削除
    const fromFolder = fromName.includes('/') ? fromName.split('/')[0] : null
    if (fromFolder) {
      await fileSystem.deleteEmptyFolder(PRESET_DIR_NAME, fromFolder)
    }

    console.info(`📦 Moved config file: ${fromName} → ${toName}`)
    return { code: 200, data: { message: 'File moved successfully', fromName, toName } }
  } catch (error: any) {
    console.error('Move file error:', error)
    if (error.code === 'ENOENT') {
      return { code: 404, data: { error: 'File not found' } }
    }
    return { code: 500, data: { error: 'Failed to move file' } }
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

    await fileSystem.saveFile(PRESET_DIR_NAME, fileName, data)
    console.info(`💾 Saved config file: ${fileName}`)
    return { code: 200, data: { message: 'File saved successfully', fileName } }
  } catch (error) {
    console.error('Save file error:', error)
    return { code: 500, data: { error: 'Failed to save file' } }
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

    await fileSystem.deleteFile(PRESET_DIR_NAME, fileName)

    // 削除元のフォルダが空になったら削除
    const folder = fileName.includes('/') ? fileName.split('/')[0] : null
    if (folder) {
      await fileSystem.deleteEmptyFolder(PRESET_DIR_NAME, folder)
    }

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
