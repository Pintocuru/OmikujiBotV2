// src/common/sounds/AssetResolver.ts
const CORE_BASE = 'http://localhost:11180/templates/custom/OmikujiBot/'
const TEMPLATE_BASE = './'

export function resolveAsset(path: string) {
  return CORE_BASE + path
}

export function resolveAssetFallback(path: string) {
  return [CORE_BASE + path, TEMPLATE_BASE + path]
}
