// src/MainGenerator/ui/ComponentMaps.ts
import { UiKind } from '@/types'
import CommentBubble from './CommentBubble/CommentBubble.vue'
import ToastWidgets from './ToastWidgets/ToastWidgets.vue'
import LiveClock from './LiveClock/LiveClock.vue'
import GameRankingViewer from './GameRanking/GameRanking.vue'
import CounterPreview from './CounterPreview/CounterPreview.vue'
import WinnerGroup from './WinnerGroup/WinnerGroup.vue'
import FlightSeat from './FlightSeat/FlightSeat.vue'
import SocialRoster from './SocialRoster/SocialRoster.vue'
import FlashBanner from './FlashBanner/FlashBanner.vue'
import DeadAir from './DeadAir/DeadAir.vue'
import StreamCounter from './StreamCounter/StreamCounter.vue'

/**
 * UiKind と Vueコンポーネントの純粋マッピング
 */
export const COMPONENT_MAP: Record<UiKind, any> = {
  bubble: CommentBubble,
  toast: ToastWidgets,
  liveClock: LiveClock,
  ranking: GameRankingViewer,
  counter: CounterPreview,
  streamCounter: StreamCounter,
  winnerGroup: WinnerGroup,
  flightSeat: FlightSeat,
  socialRoster: SocialRoster,
  flashBanner: FlashBanner,
  deadAir: DeadAir,
} as const
