// tools/viteConfig/soundAssetsPlugin.ts
import fs from 'fs'
import path from 'path'
import type { Plugin } from 'vite'

export function soundAssetsPlugin(projectRoot: string): Plugin {
  const soundsDir = path.resolve(projectRoot, 'assets/sounds')

  return {
    name: 'sound-assets-fallback',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const PREFIX = '/assets/sounds/'
        if (!req.url?.startsWith(PREFIX)) return next()

        const relativePath = req.url.slice(PREFIX.length).split('?')[0]

        // すでに中間フォルダ付きならそのまま
        if (relativePath.includes('/') && isIntermediateFolder(relativePath.split('/')[0])) {
          return next()
        }

        // フォルダ候補を動的取得
        const candidates = getIntermediateFolders(soundsDir)

        for (const folder of candidates) {
          const fullPath = path.resolve(soundsDir, folder, relativePath)
          if (fs.existsSync(fullPath)) {
            req.url = `${PREFIX}${folder}/${relativePath}`
            return next()
          }
        }

        next()
      })
    },
  }
}

function getIntermediateFolders(dir: string): string[] {
  if (!fs.existsSync(dir)) return []
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
}

function isIntermediateFolder(name: string): boolean {
  return name === 'core' || name === 'wip' || /^\d{4}-Q\d+$/.test(name)
}
