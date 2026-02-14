// src/MainGenerator/composables/useComponentRenderer.ts
import { computed, ComputedRef } from 'vue'
import { ComponentsConditions } from '@/types'
import { COMPONENT_DEFINITIONS } from '@/types/ui/ComponentKind'

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
      .filter(Boolean)
  })

  return { activeComponents }
}
