// src/ConfigMaker/components/appItems/navigation/useSidebarContext.ts
import { provide, inject, Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '@config/stores/useNavigationStore'

// ─────────────────────────────────────────────────────────
// Symbol キー
// ─────────────────────────────────────────────────────────

const SIDEBAR_CONTEXT_KEY = Symbol('sidebarContext')

// ─────────────────────────────────────────────────────────
// 型
// ─────────────────────────────────────────────────────────

type SidebarContext = {
  theme: Ref<string>
  selectedItemKey: Ref<string | null>
  activeSection: Ref<string | null>
}

// ─────────────────────────────────────────────────────────
// Provider（NavigationSidebarCategories で1回だけ呼ぶ）
// ─────────────────────────────────────────────────────────

export const provideSidebarContext = (theme: Ref<string>) => {
  const { selectedItemKey, activeSection } = storeToRefs(useNavigationStore())

  provide(SIDEBAR_CONTEXT_KEY, {
    theme,
    selectedItemKey,
    activeSection,
  } satisfies SidebarContext)
}

// ─────────────────────────────────────────────────────────
// Consumer（子孫コンポーネントで呼ぶ）
// ─────────────────────────────────────────────────────────

export const useSidebarContext = (): SidebarContext => {
  const ctx = inject<SidebarContext>(SIDEBAR_CONTEXT_KEY)
  if (!ctx) throw new Error('useSidebarContext: provideSidebarContext が呼ばれていません')
  return ctx
}
