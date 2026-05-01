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
  commentSpin: () => import('./CommentSpin/CommentSpin.vue'),
  deadAir: () => import('./DeadAir/DeadAir.vue'),
  kujibikiPanel: () => import('./KujibikiPanel/KujibikiPanel.vue'),
}
