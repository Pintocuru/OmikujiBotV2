// server/core/services/directoryService.ts
import fs from 'fs/promises'

/**
 * ディレクトリの存在を確認し、なければ作成
 */
export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.access(dirPath)
  } catch {
    await fs.mkdir(dirPath, { recursive: true })
    console.log(`📁 Created directory: ${dirPath}`)
  }
}
