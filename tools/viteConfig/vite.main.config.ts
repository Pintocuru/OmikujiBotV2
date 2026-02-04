// tools\viteConfig\vite.main.config.ts
import { defineConfig, mergeConfig, UserConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createViteAliases } from './CreateViteAliases'
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
        entry: path.resolve(projectRoot, 'src/MainGenerator/main.ts'),
        formats: ['iife'],
        name: 'MainGenerator',
        fileName: () => 'scripts/MainGenerator.js',
      },
      emptyOutDir: true,
      rollupOptions: {
        output: {
          assetFileNames: '[name].[ext]',
        },
      },
    },
  }

  return mergeConfig(base, overrideConfig)
})
