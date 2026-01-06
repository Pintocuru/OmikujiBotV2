// server/fileService.ts
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { FileItem } from './types.js'
import { generateJsContent } from '@config/components/presetsExport/generateContent'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ディレクトリ設定
export const CONFIG_DIR = path.join(__dirname, 'omikujiDatas')
const ASSETS_DIR = path.join(__dirname, '..', 'assets')
const ROOT_DIR = path.join(__dirname)

// ディレクトリを作成（存在しない場合）
export async function ensureConfigDir(): Promise<void> {
  try {
    await fs.access(CONFIG_DIR)
  } catch {
    await fs.mkdir(CONFIG_DIR, { recursive: true })
    console.log('📁 Created omikujiDatas directory:', CONFIG_DIR)
  }
}

// assetディレクトリを作成(isDevのみ)
export async function ensureAssetsDir(): Promise<void> {
  try {
    await fs.access(ASSETS_DIR)
  } catch {
    await fs.mkdir(ASSETS_DIR, { recursive: true })
    console.log('📁 Created assets directory:', ASSETS_DIR)
  }
}

// ファイル一覧を取得
export async function getFileList(): Promise<FileItem[]> {
  try {
    await ensureConfigDir()
    const files = await fs.readdir(CONFIG_DIR)
    const jsonFiles = files.filter((file) => file.endsWith('.json'))

    const fileDetails = await Promise.all(
      jsonFiles.map(async (file): Promise<FileItem> => {
        const filePath = path.join(CONFIG_DIR, file)
        const stats = await fs.stat(filePath)
        return {
          name: file,
          modified: stats.mtime.toISOString(),
        }
      })
    )

    // 更新日時で降順ソート
    return fileDetails.sort((a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime())
  } catch (error) {
    console.error('Error getting file list:', error)
    return []
  }
}

// JSONファイルを保存
export async function saveFile(fileName: string, data: string, isRoot?: boolean): Promise<void> {
  await ensureConfigDir()
  const dir = isRoot ? ROOT_DIR : CONFIG_DIR
  const filePath = path.join(dir, fileName)
  await fs.writeFile(filePath, data, 'utf8')
}

// おみくじデータをJSファイルとして保存
export async function saveOmikujiData(configData: string, isExpress?: boolean): Promise<void> {
  await ensureAssetsDir()
  const jsContent = generateJsContent(configData)
  const dir = isExpress ? ASSETS_DIR : ROOT_DIR

  const filePath = path.join(dir, 'omikujiData.js')
  await fs.writeFile(filePath, jsContent, 'utf8')
}

// ファイルを読み込み
export async function loadFile(fileName: string, isRoot?: boolean): Promise<any> {
  const dir = isRoot ? ROOT_DIR : CONFIG_DIR
  const filePath = path.join(dir, fileName)
  const data = await fs.readFile(filePath, 'utf8')
  return JSON.parse(data)
}

// ファイルを削除
export async function deleteFile(fileName: string): Promise<void> {
  const filePath = path.join(CONFIG_DIR, fileName)
  await fs.unlink(filePath)
}
