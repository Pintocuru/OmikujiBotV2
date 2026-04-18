// src/ConfigMaker/scripts/useScrollToSection.ts
import { watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '@config/stores/useNavigationStore'

// ナビゲーションからのクリックから発動する、スクロールの制御
export const useScrollToSection = () => {
  const navigationStore = useNavigationStore()
  const { activeSection, selectedItemKey } = storeToRefs(navigationStore)

  watch([selectedItemKey, activeSection], async ([, section]) => {
    if (!section) return

    await nextTick()

    const el = document.getElementById(`section-${section}`)
    if (!el) return

    el.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  })
}
