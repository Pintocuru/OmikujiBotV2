// tools/viteBuild/buildOptions/plugins.ts
import type { Plugin } from 'vite'

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

