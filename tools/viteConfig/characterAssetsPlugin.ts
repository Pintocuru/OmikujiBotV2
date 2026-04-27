// tools/viteConfig/characterAssetsPlugin.ts
import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

/**
 * /assets/Characters/{name} へのリクエストを
 * common/ または YYYY-QN/ フォルダから探して返すプラグイン
 */
export function characterAssetsPlugin(projectRoot: string): Plugin {
  const charsDir = path.resolve(projectRoot, 'assets/Characters')

  return {
    name: 'character-assets-fallback',
    apply: 'serve', // 開発サーバーのみ
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const PREFIX = '/assets/Characters/'
        if (!req.url?.startsWith(PREFIX)) return next()

        const relativePath = req.url.slice(PREFIX.length).split('?')[0]

        // すでに中間フォルダ付きのパスなら素通し
        if (relativePath.includes('/') && isIntermediateFolder(relativePath.split('/')[0])) {
          return next()
        }

        // 中間フォルダ候補を動的に取得（フォルダ追加時に自動対応）
        const candidates = getIntermediateFolders(charsDir)
        for (const folder of candidates) {
          const fullPath = path.resolve(charsDir, folder, relativePath)
          if (fs.existsSync(fullPath)) {
            req.url = `${PREFIX}${folder}/${relativePath}`
            return next()
          }
        }

        next() // 見つからなければ通常の404
      })
    },
  }
}

/** assets/Characters/ 直下の中間フォルダ一覧を動的取得 */
function getIntermediateFolders(charsDir: string): string[] {
  if (!fs.existsSync(charsDir)) return []
  return fs
    .readdirSync(charsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && isIntermediateFolder(d.name))
    .map((d) => d.name)
}

/** 中間フォルダかどうかの判定 */
function isIntermediateFolder(name: string): boolean {
  return name === 'common' || name === 'wip' || /^\d{4}-Q\d+$/.test(name)
}
