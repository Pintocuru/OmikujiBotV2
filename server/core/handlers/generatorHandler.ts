// server/handlers/generatorHandler.ts
import { RouteResult } from '../types'
import * as fileSystem from '../services/fileSystemService'

const GENERATOR_FILE = 'generator.json'

/**
 * Generator設定を読み込み
 */
export async function loadGeneratorConfig(): Promise<RouteResult> {
  try {
    const data = await fileSystem.loadFile(GENERATOR_FILE, true)
    console.info(`📖 Loaded generator config: ${GENERATOR_FILE}`)
    return { code: 200, data }
  } catch (error: any) {
    console.error('Load generator error:', error)
    if (error.code === 'ENOENT') {
      return { code: 404, data: { error: 'Generator config not found' } }
    }
    return { code: 500, data: { error: 'Failed to load generator config' } }
  }
}

/**
 * Generator設定を保存
 */
export async function saveGeneratorConfig(data: string): Promise<RouteResult> {
  try {
    if (!data) {
      return { code: 400, data: { error: 'data is required' } }
    }

    await fileSystem.saveFile(GENERATOR_FILE, data, true)
    console.info(`💾 Saved generator config: ${GENERATOR_FILE}`)
    return { code: 200, data: { message: 'Generator config saved successfully', fileName: GENERATOR_FILE } }
  } catch (error) {
    console.error('Save generator error:', error)
    return { code: 500, data: { error: 'Failed to save generator config' } }
  }
}
