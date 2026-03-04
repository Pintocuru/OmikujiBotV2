// tools/viteConfig/vite.configmaker.config.ts
import { defineConfig, mergeConfig, UserConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import { createViteAliases } from './CreateViteAliases'
import { baseViteConfig,  } from '../../../../shared/utils/ViteConfig/viteConfigBase'

// projectRoot の設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')
const base = baseViteConfig(projectRoot)

// tsconfig.json からエイリアスを生成
export const alias = { ...createViteAliases(projectRoot) }

export default defineConfig(() => {

  const overrideConfig: UserConfig = {
    root: path.resolve(projectRoot),
    resolve: { alias },
    build: {
      lib: {
        entry: path.resolve(projectRoot, 'src/ConfigMaker/main.ts'),
        formats: ['iife'],
        name: 'ConfigMaker',
        fileName: () => 'scripts/ConfigMaker.js',
      },
      emptyOutDir: false,
      rollupOptions: {
        output: {
          assetFileNames: '[name].[ext]',
        },
      },
    },
  }

  return mergeConfig(base, overrideConfig)
})
