// server/handlers/commonHandlers.ts
import { getFileList, saveFile, saveOmikujiData, loadFile, deleteFile } from '../fileService.js'

// 共通の結果型
export interface HandlerResult {
  code: number
  data: any
}

// ファイル名のバリデーション
function validateFileName(fileName: string): boolean {
  return /^[\w\-. ]+\.json$/.test(fileName)
}

// 共通ハンドラー（Pure Business Logic）
export async function listFilesHandler(): Promise<HandlerResult> {
  try {
    const files = await getFileList()
    return { code: 200, data: files }
  } catch (error) {
    console.error('List files error:', error)
    return { code: 500, data: { error: 'Failed to list files' } }
  }
}

export async function saveFileHandler(fileName: string, data: string): Promise<HandlerResult> {
  try {
    if (!fileName || !data) {
      return { code: 400, data: { error: 'fileName and data are required' } }
    }

    if (!validateFileName(fileName)) {
      return { code: 400, data: { error: 'Invalid file name' } }
    }

    await saveFile(fileName, data)
    console.info(`💾 Saved config file: ${fileName}`)
    return { code: 200, data: { message: 'File saved successfully', fileName } }
  } catch (error) {
    console.error('Save file error:', error)
    return { code: 500, data: { error: 'Failed to save file' } }
  }
}

export async function saveOmikujiHandler(
  configData: string,
  mode: 'plugin' | 'express' = 'plugin'
): Promise<HandlerResult> {
  try {
    if (!configData) {
      return { code: 400, data: { error: 'configData is required' } }
    }

    await saveOmikujiData(configData, mode)
    console.info('🎋 Saved omikuji data to assets/omikujiData.js')
    return {
      code: 200,
      data: { message: 'Omikuji data saved successfully', filePath: 'assets/omikujiData.js' },
    }
  } catch (error) {
    console.error('Save omikuji error:', error)
    return { code: 500, data: { error: 'Failed to save omikuji data' } }
  }
}

export async function loadFileHandler(fileName: string): Promise<HandlerResult> {
  try {
    if (!fileName) {
      return { code: 400, data: { error: 'fileName is required' } }
    }

    if (!validateFileName(fileName)) {
      return { code: 400, data: { error: 'Invalid file name' } }
    }

    const data = await loadFile(fileName)
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

export async function deleteFileHandler(fileName: string): Promise<HandlerResult> {
  try {
    if (!fileName) {
      return { code: 400, data: { error: 'fileName is required' } }
    }

    if (!validateFileName(fileName)) {
      return { code: 400, data: { error: 'Invalid file name' } }
    }

    await deleteFile(fileName)
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

export function healthCheckHandler(): HandlerResult {
  return {
    code: 200,
    data: { status: 'OK', message: 'API is running' },
  }
}
