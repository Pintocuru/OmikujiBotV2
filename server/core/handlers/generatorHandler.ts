// server/core/handlers/generatorHandler.ts
import { RouteResult } from '../types'
import * as fileSystem from '../services/fileSystemService'

const GENERATOR_FILE = 'generator.json'
const PACKAGES_DIR_NAME = 'packages'

/**
 * Generator設定を読み込み
 */
export async function loadGeneratorConfig(fileName: string | null): Promise<RouteResult> {
  try {
    const dir = fileName ? PACKAGES_DIR_NAME : null

    const data = await fileSystem.loadFile(dir, fileName ?? GENERATOR_FILE)
    console.info(`📖 Loaded generator config: ${fileName}`)
    return { code: 200, data }
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.info('Generator config not found:', fileName)
      return { code: 404, data: { error: 'Generator config not found' } }
    }
    console.error('Load generator error:', error)
    return { code: 500, data: { error: 'Failed to load generator config' } }
  }
}

/**
 * Generator設定を保存
 */
export async function saveGeneratorConfig(data: string, fileName?: string): Promise<RouteResult> {
  try {
    if (!data) {
      return { code: 400, data: { error: 'data is required' } }
    }

    const dir = fileName ? PACKAGES_DIR_NAME : null

    await fileSystem.saveFile(dir, fileName ?? GENERATOR_FILE, data)

    console.info(`💾 Saved generator config: ${fileName ?? GENERATOR_FILE}`)
    return {
      code: 200,
      data: {
        message: 'Generator config saved successfully',
        fileName: fileName ?? GENERATOR_FILE,
      },
    }
  } catch (error) {
    console.error('Save generator error:', error)
    return { code: 500, data: { error: 'Failed to save generator config' } }
  }
}
