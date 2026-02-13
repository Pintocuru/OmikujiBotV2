// src/MainGenerator/composables/useComponentRenderer.ts
import { computed, ComputedRef } from 'vue'
import { COMPONENT_MAPPINGS } from '@main/ui/ComponentMapping'
import { ComponentsConditions } from '@/types'

export function useComponentRenderer(
  conditions: ComputedRef<ComponentsConditions>,
  isComment: ComputedRef<boolean>,
  isTimer: ComputedRef<boolean>
) {
  const activeComponents = computed(() => {
    return conditions.value
      .map((condition) => {
        const mapping = COMPONENT_MAPPINGS.find((m) => m.kind === condition.kind)
        if (!mapping) return null

        if (
          mapping.shouldRender &&
          !mapping.shouldRender({
            isComment: isComment.value,
            isTimer: isTimer.value,
          })
        ) {
          return null
        }

        return {
          slot: condition.slot,
          component: mapping.component,
          props: mapping.props,
        }
      })
      .filter(Boolean)
  })

  return { activeComponents }
}
