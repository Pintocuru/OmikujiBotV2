// [Package] vite.config.ts
import { defineConfig, mergeConfig, UserConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createViteAliases } from './createViteAliases'
import { baseViteConfig, rootAlias } from '../../../../shared/utils/ViteConfig/viteConfigBase'

// projectRoot の設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')
const base = baseViteConfig(projectRoot)

// tsconfig.json からエイリアスを生成
export const alias = { ...rootAlias, ...createViteAliases(projectRoot) }

export default defineConfig(() => {
  const checkLevel = process.env.VITE_TS_CHECK_LEVEL || 'development'

  const overrideConfig: UserConfig = {
    root: path.resolve(projectRoot),
    resolve: { alias },
    build: {
      lib: {
        entry: path.resolve(projectRoot, 'src/ConfigMaker/main.ts'),
        formats: ['iife'],
        name: 'ConfigMaker',
        fileName: () => 'ConfigMaker.js',
      },
      target: 'node18',
      outDir: 'dist-plugin',
      emptyOutDir: true,
      rollupOptions: {
        output: {
          entryFileNames: 'scripts/[name].js',
          assetFileNames: 'scripts/[name].[ext]',
        },
      },
    },
  }

  return mergeConfig(base, overrideConfig)
})
