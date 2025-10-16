// tools/JsonMerge/fileLoader.ts
import fs from 'fs'
import path from 'path'
import type { OmikujiDataType } from '@/types/OmikujiData/OmikujiDataSchema'

/**
 * ソースファイルをファイルシステムから読み込み、パースする
 *
 * @param sourceFile - 読み込むファイルの相対パス
 * @param jsonPathRoot - 相対パスの基準ディレクトリ
 * @returns パースされたOmikujiData
 * @throws ファイル読み込みまたはJSON解析に失敗した場合
 */
export function loadSourceFile(sourceFile: string, jsonPathRoot: string): OmikujiDataType {
  const filePath = path.resolve(jsonPathRoot, sourceFile)

  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const jsonData = JSON.parse(content) as OmikujiDataType
    console.log(`[JsonMerge] Loaded source file: ${filePath}`)
    return jsonData
  } catch (error) {
    throw new Error(`Failed to load source file: ${filePath}. Error: ${error}`)
  }
}
