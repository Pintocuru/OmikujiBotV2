// server/services/fileSystemService.ts
import fs from 'fs/promises'
import path from 'path'
import { FileItem } from '../types'
import { generateJsContent } from '@config/components/presetsExport/generateContent'
import { ASSETS_DIR, ROOT_DIR } from '../../dev-api'
import { ensureDirectory } from './directoryService'

/**
 * ファイル一覧を取得
 */
export async function getFileList(rootName: string | null): Promise<FileItem[]> {
  try {
    const dir = rootName ? path.join(ROOT_DIR, rootName) : ROOT_DIR

    await ensureDirectory(dir)

    const files = await fs.readdir(dir)
    const jsonFiles = files.filter((file) => file.endsWith('.json'))

    const fileDetails = await Promise.all(
      jsonFiles.map(async (file): Promise<FileItem> => {
        const filePath = path.join(dir, file)
        const stats = await fs.stat(filePath)
        return {
          name: file,
          modified: stats.mtime.toISOString(),
        }
      })
    )

    return fileDetails.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
  } catch (error) {
    console.error('Error getting file list:', error)
    return []
  }
}

/**
 * ファイルを読み込み
 */
export async function loadFile(rootName: string | null, fileName: string): Promise<any> {
  const dir = rootName ? path.join(ROOT_DIR, rootName) : ROOT_DIR

  const filePath = path.join(dir, fileName)
  const data = await fs.readFile(filePath, 'utf8')
  return JSON.parse(data)
}

/**
 * JSONファイルを保存
 */
export async function saveFile(rootName: string | null, fileName: string, data: string): Promise<void> {
  const dir = rootName ? path.join(ROOT_DIR, rootName) : ROOT_DIR

  await ensureDirectory(dir)

  const filePath = path.join(dir, fileName)
  await fs.writeFile(filePath, data, 'utf8')
}

/**
 * ファイルを削除
 */
export async function deleteFile(rootName: string | null, fileName: string): Promise<void> {
  const dir = rootName ? path.join(ROOT_DIR, rootName) : ROOT_DIR

  const filePath = path.join(dir, fileName)
  await fs.unlink(filePath)
}

/**
 * おみくじデータをJSファイルとして保存
 */
export async function saveOmikujiData(configData: string, isExpress?: boolean): Promise<void> {
  const jsContent = generateJsContent(configData)
  const dir = isExpress ? ASSETS_DIR : ROOT_DIR

  await ensureDirectory(dir)
  const filePath = path.join(dir, 'omikujiData.js')
  await fs.writeFile(filePath, jsContent, 'utf8')
}
