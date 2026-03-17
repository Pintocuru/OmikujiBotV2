// tools/viteConfig/vite.botPlugin.config.ts
import { defineConfig, mergeConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import tsconfig from '../../tsconfig.json'
import { baseViteConfig, } from '../../../../shared/utils/ViteConfig/viteConfigBase'
import { createAliases } from '../../../../shared/utils/webpackBuild/utils/CreateAliases'
import { APP_VERSION } from '../../src/version'

// projectRoot の設定
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../../')
const base = baseViteConfig(projectRoot)

// tsconfig.json からエイリアスを生成
const tsAliases = createAliases(projectRoot, tsconfig)
export const alias = { ...tsAliases }

export default defineConfig(() => {
  return mergeConfig(base, {
    // ビルド設定
    build: {
      // ライブラリモードで構築
      lib: {
        entry: path.resolve(projectRoot, 'src/EditorPlugin/plugin.ts'),
        name: 'Plugin',
        fileName: () => `EditorPlugin-${APP_VERSION}/plugin.js`,
        formats: ['cjs'], // 出力形式は CommonJS 指定
      },

      // 出力ディレクトリ
      outDir: 'dist',
      emptyOutDir: true,

      // ロールアップ設定
      rollupOptions: {
        // plugins: [visualizer({ open: true })], // 同梱物チェック用
        // 外部依存関係の指定
        external: [
          'fs',
          'fs/promises',
          'path',
          'events',
          'stream',
          'buffer',
          'os',
          'url',
          'querystring',
          '@onecomme.com/onesdk',
          'electron-store',
        ],
        output: {
          // デフォルトエクスポートをCommonJSのexportsに直接変換
          exports: 'default',
        },
      },

      // ミニファイ設定
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: false, // Console.logを削除するか
          drop_debugger: true,
        },
        mangle: {
          // 特定の関数名は保持
          reserved: [
            'init',
            // 'subscribe',
            // 'filterComment',
            // 'filterSpeech'
            'request',
            'destroy',
          ],
        },
      },

   
      sourcemap: false,   // ソースマップ生成

  
      chunkSizeWarningLimit: 1000,    // チャンクサイズ警告の無効化
    },

    // 解決設定
    resolve: { alias: alias },
    test: {
      silent: false,   // コンソールメッセージを有効にする
      globals: true,    // その他の設定
    },
  })
})
