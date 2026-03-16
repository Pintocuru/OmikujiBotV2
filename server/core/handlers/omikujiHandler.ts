// server/core/handlers/omikujiHandler.ts
import { RouteResult } from '../types'
import * as fileSystem from '../services/fileSystemService'

/**
 * おみくじデータを保存
 */
export async function saveOmikujiData(configData: string, isExpress?: boolean): Promise<RouteResult> {
  try {
    if (!configData) {
      return { code: 400, data: { error: 'configData is required' } }
    }

    await fileSystem.saveOmikujiData(configData, isExpress)
    console.info('🎋 Saved omikuji data to server/omikujiData.js')
    return {
      code: 200,
      data: { message: 'Omikuji data saved successfully', filePath: 'server/omikujiData.js' },
    }
  } catch (error) {
    console.error('Save omikuji error:', error)
    return { code: 500, data: { error: 'Failed to save omikuji data' } }
  }
}
