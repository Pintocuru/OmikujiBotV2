// src/MainGenerator/ui/ComponentMaps.ts
import { UiKind } from '@/types'

// 静的COMPONENT_MAPを廃止し、動的importに変換
export const COMPONENT_MAP_LOADER: Record<UiKind, () => Promise<any>> = {
  bubble: () => import('./CommentBubble/CommentBubble.vue'),
  toast: () => import('./ToastWidgets/ToastWidgets.vue'),
  liveClock: () => import('./LiveClock/LiveClock.vue'),
  ranking: () => import('./GameRanking/GameRanking.vue'),
  counter: () => import('./CounterPreview/CounterPreview.vue'),
  streamCounter: () => import('./StreamCounter/StreamCounter.vue'),
  cookieCounter: () => import('./CookieCounter/CookieCounter.vue'),
  winnerGroup: () => import('./WinnerGroup/WinnerGroup.vue'),
  flightSeat: () => import('./FlightSeat/FlightSeat.vue'),
  socialRoster: () => import('./SocialRoster/SocialRoster.vue'),
  flashBanner: () => import('./FlashBanner/FlashBanner.vue'),
  deadAir: () => import('./DeadAir/DeadAir.vue'),
}

/**
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
import CookieCounter from './CookieCounter/CookieCounter.vue'


// UiKind と Vueコンポーネントの純粋マッピング
export const COMPONENT_MAP: Record<UiKind, any> = {
  bubble: CommentBubble,
  toast: ToastWidgets,
  liveClock: LiveClock,
  ranking: GameRankingViewer,
  counter: CounterPreview,
  streamCounter: StreamCounter,
  cookieCounter: CookieCounter,
  winnerGroup: WinnerGroup,
  flightSeat: FlightSeat,
  socialRoster: SocialRoster,
  flashBanner: FlashBanner,
  deadAir: DeadAir,
} as const
 */
