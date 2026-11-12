// tools/viteBuild/core/ViteRunner.ts
import path from 'path'
import { build, mergeConfig } from 'vite'
import { baseViteConfig } from '../../../../../shared/utils/ViteConfig/viteConfigBase'
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
    const baseConfig = baseViteConfig(config.packageRoot)
    const viteConfig = mergeConfig(baseConfig, {
      configFile: false,
      mode: 'production',
      envDir: false,
      resolve: { alias: config.system.alias },
      esbuild: { drop: ['console', 'debugger'] },
      define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
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
          output: {
            globals: GLOBALS,
            inlineDynamicImports: true,
            assetFileNames: '[name].[ext]',
          },
        },
      },
    })

    await build(viteConfig)
    firstEntry = false
  }
}
