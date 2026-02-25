// tools/viteConfig/CreateViteAliases.ts
import path from 'path'
import tsconfig from '../../tsconfig.json'

// tsconfig.json の paths を Vite の resolve.alias 形式に変換する関数
export function createViteAliases(baseDir: string): Record<string, string> {
  const aliases: Record<string, string> = {}
  const paths = tsconfig.compilerOptions.paths

  // paths が存在しない場合は空のオブジェクトを返す
  if (!paths) return aliases

  // tsconfig.json のパスを Vite の形式に変換
  type PathsType = typeof tsconfig.compilerOptions.paths
  for (const alias of Object.keys(paths) as (keyof PathsType)[]) {
    const value = paths[alias][0]
    const key = alias.replace('/*', '')
    // `/*` を取り除き、`path.resolve` で絶対パスに変換
    aliases[key] = path.resolve(baseDir, value.replace('/*', ''))
  }

  return aliases
}
