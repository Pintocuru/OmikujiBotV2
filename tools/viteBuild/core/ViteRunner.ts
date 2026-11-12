// tools/viteBuild/core/ViteRunner.ts
import path from 'path'
import { build, type InlineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { externalDynamicImportPlugin } from '../buildOptions/plugins'
import type { ResolvedCoreBuildConfig } from '../types'

const EXTERNALS = ['vue', '@onecomme.com/onesdk']
const GLOBALS = { vue: 'Vue', '@onecomme.com/onesdk': 'OneSDK' }

export async function runViteCore(config: ResolvedCoreBuildConfig, outputSubDir: string): Promise<void> {
  const outputDir = path.join(config.packageRoot, 'dist', outputSubDir)
  let firstEntry = true

  if (typeof config.entryPoints === 'string') {
    throw new Error('[Vite] Core build requires named entry points')
  }

  for (const [name, entry] of Object.entries(config.entryPoints)) {
    const viteConfig: InlineConfig = {
      configFile: false,
      root: config.packageRoot,
      mode: 'production',
      envDir: false,
      logLevel: 'warn',
      plugins: [externalDynamicImportPlugin(), vue(), tailwindcss()],
      css: { postcss: { plugins: [] } },
      resolve: { alias: config.system.alias },
      esbuild: { drop: ['console', 'debugger'] },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      },
      build: {
        outDir: outputDir,
        emptyOutDir: firstEntry,
        sourcemap: false,
        lib: {
          entry,
          formats: ['iife'],
          name: `OmikujiBot_${name}`,
          fileName: () => `scripts/${name}.js`,
          cssFileName: `scripts/${name}`,
        },
        rollupOptions: {
          external: EXTERNALS,
          onwarn(warning, defaultHandler) {
            if (warning.code !== 'CIRCULAR_DEPENDENCY') {
              defaultHandler(warning)
              return
            }
            if (warning.ids?.some((id) => id.includes('node_modules'))) return
            throw new Error(`[Build] 循環依存を検出しました: ${warning.message}`)
          },
          output: {
            globals: GLOBALS,
            inlineDynamicImports: true,
            assetFileNames: '[name].[ext]',
          },
        },
      },
    }

    await build(viteConfig)
    firstEntry = false
  }
}
