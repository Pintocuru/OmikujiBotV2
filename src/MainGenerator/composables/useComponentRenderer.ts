// src/MainGenerator/composables/useComponentRenderer.ts
import { computed } from 'vue'
import { UiKind, UiSlotType } from '@/types'
import CommentBubble from '@main/ui/CommentBubble/CommentBubble.vue'
import ToastWidgets from '@main/ui/ToastWidgets/ToastWidgets.vue'
import GameRankingViewer from '@main/ui/GameRanking/GameRanking.vue'
import CounterPreview from '@main/ui/CounterPreview/CounterPreview.vue'
import WinnerGroup from '@main/ui/WinnerGroup/WinnerGroup.vue'
import FlightSeat from '@main/ui/FlightSeat/FlightSeat.vue'
import SocialRoster from '@main/ui/SocialRoster/SocialRoster.vue'
import FlashBanner from '@main/ui/FlashBanner/FlashBanner.vue'
import { useAppStore } from '../stores/useAppStore'
import { useVisibilityAccess } from '../scripts/FeatureAccess/useAccessCheckerMain'
import StreamCounter from '../ui/StreamCounter/StreamCounter.vue'

/**
 * 各UiKindに対応するVueコンポーネントと、レンダリング可否の条件を管理するマップ
 * shouldRender が未定義の場合は常に表示する
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
  streamCounter: {
    component: StreamCounter,
  },
  winnerGroup: {
    component: WinnerGroup,
  },
  flightSeat: {
    component: FlightSeat,
  },
  socialRoster: {
    component: SocialRoster,
  },
  flashBanner: {
    component: FlashBanner,
  },
} as const

const SLOT_PRIORITY = { primary: 2, secondary: 2, extra: 1 } as const

/**
 * conditions に基づいてアクティブなコンポーネント一覧を返す
 * shouldRender が false を返すエントリは除外される
 */
export function useComponentRenderer() {
  const appStore = useAppStore()
  const conditions = computed(() => appStore.data.components.conditions)
  const { isComment, isTimer } = useVisibilityAccess()

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
