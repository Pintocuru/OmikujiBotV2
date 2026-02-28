// src/common/LucideIcon/useLucideIcon.ts
import * as Icons from 'lucide-vue-next'
import { Package } from 'lucide-vue-next'
import type { Component } from 'vue'

/**
 * アイコン名の文字列 → Lucide Vueコンポーネントに解決するユーティリティ
 */
export function resolveLucideIcon(iconName: string | undefined): Component {
  if (!iconName) return Package
  return (Icons as Record<string, any>)[iconName] ?? Package
}
