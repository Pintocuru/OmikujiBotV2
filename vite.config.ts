// [Package] vite.config.ts
import { defineConfig, mergeConfig, UserConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createViteAliases } from './tools/viteConfig/createViteAliases'
import { baseViteConfig, rootAlias } from '../../shared/utils/ViteConfig/viteConfigBase'

// projectRoot の設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname)
const base = baseViteConfig(projectRoot)

// tsconfig.json からエイリアスを生成
export const alias = { ...rootAlias, ...createViteAliases(projectRoot) }

export default defineConfig(() => {
  const checkLevel = process.env.VITE_TS_CHECK_LEVEL || 'development'

  const overrideConfig: UserConfig = {
    root: path.resolve(projectRoot),
    resolve: { alias },
    optimizeDeps: {
      // キャッシュの再構築を促すため、一度除外してみる
      exclude: ['vue-draggable-plus'],
    },
    server: {
      watch: {
        ignored: [path.resolve(projectRoot, 'server/presets/**')],
      },
    },
  }

  return mergeConfig(base, overrideConfig)
})
