// server/core/services/fileSystemService.ts
import fs from 'fs/promises'
import path from 'path'
import { FileItem } from '../types'
import { generateJsContent } from '@config/components/presetsExport/generateContent'
import { ensureDirectory } from './directoryService'
import { DIR } from '../../constants'

/**
 * ファイル一覧を再帰的に取得（フォルダネスト対応）
 */
export async function getFileList(rootName: string | null): Promise<FileItem[]> {
  try {
    const baseDir = rootName ? path.join(DIR.root, rootName) : DIR.root
    await ensureDirectory(baseDir)

    const results = await collectJsonFiles(baseDir, baseDir)
    return results.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
  } catch (error) {
    console.error('Error getting file list:', error)
    return []
  }
}

/**
 * 再帰的にJSONファイルを収集
 * @param currentDir 現在探索中のディレクトリ
 * @param baseDir ルートディレクトリ（相対パス計算用）
 */
async function collectJsonFiles(currentDir: string, baseDir: string): Promise<FileItem[]> {
  const entries = await fs.readdir(currentDir, { withFileTypes: true })
  const results: FileItem[] = []

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name)

    if (entry.isDirectory()) {
      // サブフォルダを再帰探索
      const nested = await collectJsonFiles(fullPath, baseDir)
      results.push(...nested)
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      const stats = await fs.stat(fullPath)
      // baseDir からの相対パスを name として返す（例: "folder/file.json"）
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/')
      results.push({
        name: relativePath,
        modified: stats.mtime.toISOString(),
      })
    }
  }

  return results
}

/**
 * ファイルを移動（リネーム）
 */
export async function moveFile(rootName: string | null, fromName: string, toName: string): Promise<void> {
  const dir = rootName ? path.join(DIR.root, rootName) : DIR.root

  const fromPath = path.join(dir, fromName)
  const toPath = path.join(dir, toName)

  // 移動先フォルダを作成
  await ensureDirectory(path.dirname(toPath))
  await fs.rename(fromPath, toPath)
}

/**
 * ファイルを読み込み
 */
export async function loadFile(rootName: string | null, fileName: string): Promise<any> {
  const dir = rootName ? path.join(DIR.root, rootName) : DIR.root

  const filePath = path.join(dir, fileName)
  const data = await fs.readFile(filePath, 'utf8')
  return JSON.parse(data)
}

/**
 * JSONファイルを保存
 */
export async function saveFile(rootName: string | null, fileName: string, data: string): Promise<void> {
  const dir = rootName ? path.join(DIR.root, rootName) : DIR.root

  await ensureDirectory(dir)

  const filePath = path.join(dir, fileName)
  await fs.writeFile(filePath, data, 'utf8')
}

/**
 * ファイルを削除
 */
export async function deleteFile(rootName: string | null, fileName: string): Promise<void> {
  const dir = rootName ? path.join(DIR.root, rootName) : DIR.root

  const filePath = path.join(dir, fileName)
  await fs.unlink(filePath)
}

/**
 * おみくじデータをJSファイルとして保存
 */
export async function saveOmikujiData(configData: string, isExpress?: boolean): Promise<void> {
  const jsContent = generateJsContent(configData)
  const dir = isExpress ? DIR.assets : DIR.root

  await ensureDirectory(dir)
  const filePath = path.join(dir, 'omikujiData.js')
  await fs.writeFile(filePath, jsContent, 'utf8')
}

/**
 * 指定フォルダが空なら削除する（presetsDir直下の1階層のみ）
 */
export async function deleteEmptyFolder(rootName: string, folderName: string): Promise<void> {
  const folderPath = path.join(DIR.root, rootName, folderName) // ← DIR.root を追加
  try {
    const entries = await fs.readdir(folderPath)
    if (entries.length === 0) {
      await fs.rmdir(folderPath)
      console.info(`🗂️ Removed empty folder: ${folderName}`)
    }
  } catch (error: any) {
    if (error.code !== 'ENOENT') throw error
  }
}
