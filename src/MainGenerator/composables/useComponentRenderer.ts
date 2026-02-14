// src/MainGenerator/composables/useComponentRenderer.ts
import { computed, ComputedRef } from 'vue'
import { ComponentsConditions } from '@/types'
import { COMPONENT_DEFINITIONS, ComponentMapping } from '@/types/ui/ComponentKind'

const SLOT_PRIORITY = { primary: 2, secondary: 2, extra: 1 } as const

export function useComponentRenderer(
  conditions: ComputedRef<ComponentsConditions>,
  isComment: ComputedRef<boolean>,
  isTimer: ComputedRef<boolean>
) {
  const activeComponents = computed(() => {
    return conditions.value
      .map((condition) => {
        const mapping = COMPONENT_DEFINITIONS[condition.kind]

        if ('shouldRender' in mapping && mapping.shouldRender) {
          if (!mapping.shouldRender({ isComment: isComment.value, isTimer: isTimer.value })) {
            return null
          }
        }

        return {
          slot: condition.slot,
          component: mapping.component,
        }
      })
      .filter((item): item is ComponentMapping => item !== null)
      .sort((a, b) => SLOT_PRIORITY[b.slot] - SLOT_PRIORITY[a.slot])
  })

  return { activeComponents }
}
