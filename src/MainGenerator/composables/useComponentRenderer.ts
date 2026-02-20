// src/MainGenerator/composables/useComponentRenderer.ts
import { computed, ComputedRef } from 'vue'
import { ComponentsConditions, UiKind, UiSlotType } from '@/types'
import CommentBubble from '@main/ui/CommentBubble/CommentBubble.vue'
import ToastWidgets from '@main/ui/ToastWidgets/ToastWidgets.vue'
import GameRankingViewer from '@main/ui/GameRanking/GameRanking.vue'
import CounterPreview from '@main/ui/CounterPreview/CounterPreview.vue'
import WinnerGroup from '@main/ui/WinnerGroup/WinnerGroup.vue'
import FlightSeat from '@main/ui/FlightSeat/FlightSeat.vue'
import FlashBanner from '@main/ui/FlashBanner/FlashBanner.vue'

/**
 * ??
 */
interface ComponentMapEntry {
  component: any
  shouldRender?: (ctx: { isComment: boolean; isTimer: boolean }) => boolean
}

const COMPONENT_MAP: Record<UiKind, ComponentMapEntry> = {
  bubble: {
    component: CommentBubble,
  },
  toast: {
    component: ToastWidgets,
  },
  ranking: {
    component: GameRankingViewer,
  },
  counter: {
    component: CounterPreview,
    shouldRender: ({ isComment }) => isComment,
  },
  winnerGroup: {
    component: WinnerGroup,
  },
  flightSeat: {
    component: FlightSeat,
  },
  flashBanner: {
    component: FlashBanner,
  },
} as const

const SLOT_PRIORITY = { primary: 2, secondary: 2, extra: 1 } as const

/**
 * ??
 */
export function useComponentRenderer(
  conditions: ComputedRef<ComponentsConditions>,
  isComment: ComputedRef<boolean>,
  isTimer: ComputedRef<boolean>
) {
  const activeComponents = computed(() => {
    return conditions.value
      .map((condition) => {
        const mapping = COMPONENT_MAP[condition.kind]

        if (
          mapping.shouldRender?.({
            isComment: isComment.value,
            isTimer: isTimer.value,
          }) === false
        ) {
          return null
        }

        return {
          slot: condition.slot,
          component: mapping.component,
        }
      })
      .filter((item): item is { slot: UiSlotType; component: any } => item !== null)
      .sort((a, b) => SLOT_PRIORITY[b.slot] - SLOT_PRIORITY[a.slot])
  })

  return { activeComponents }
}
