// tools/viteBuild/buildOptions/plugins.ts
import type { Plugin, RollupWarning, WarningHandler } from 'rollup'

/**
 * IIFE形式ではOneSDKの動的importをglobal参照へ変換する。
 */
export function externalDynamicImportPlugin(): Plugin {
  const pattern = /import\(\s*(['"])@onecomme\.com\/onesdk\1\s*\)/g
  return {
    name: 'external-dynamic-import-to-global',
    enforce: 'pre',
    transform(code, id) {
      if (id.includes('node_modules') || !code.includes('@onecomme.com/onesdk')) return null
      const replaced = code.replace(pattern, 'Promise.resolve({ ...window.OneSDK, default: window.OneSDK })')
      return replaced === code ? null : { code: replaced, map: null }
    },
  }
}

/**
 * アプリケーションコード内の循環依存はビルドエラーにする。
 */
export function failOnCircularDependency(warning: RollupWarning, defaultHandler: WarningHandler): void {
  if (warning.code !== 'CIRCULAR_DEPENDENCY') {
    defaultHandler(warning)
    return
  }
  if (warning.ids?.some((id) => id.includes('node_modules'))) return
  throw new Error(`[Build] 循環依存を検出しました: ${warning.message}`)
}
