// src\MainGenerator\ui\ComponentMapping.ts
import type { Component } from 'vue'
import { ComponentKind } from '@/types'
import CommentBubble from '@main/ui/CommentBubble/CommentBubble.vue'
import ToastWidgets from '@main/ui/ToastWidgets/ToastWidgets.vue'
import GameRankingViewer from '@main/ui/GameRanking/GameRanking.vue'
import CounterPreview from '@main/ui/CounterPreview/CounterPreview.vue'
import WinnerGroup from '@main/ui/WinnerGroup/WinnerGroup.vue'
import FlightSeat from '@main/ui/FlightSeat/FlightSeat.vue'

// コンポーネントマッピング定義
interface ComponentMapping {
  kind: ComponentKind
  component: Component
  props?: Record<string, any>
  shouldRender?: (ctx: { isComment: boolean; isTimer: boolean }) => boolean // 追加の表示条件
}

export const COMPONENT_MAPPINGS: ComponentMapping[] = [
  // フキダシ
  {
    kind: 'bubble',
    component: CommentBubble,
  },
  // トースト・サムネイル
  {
    kind: 'toast',
    component: ToastWidgets,
  },
  // ランキング
  {
    kind: 'ranking',
    component: GameRankingViewer,
  },
  // カウンター
  {
    kind: 'counter',
    component: CounterPreview,
    shouldRender: ({ isComment }) => isComment, // コメント機能が有効な時のみ
  },
  // ラッキーメンバーズ
  {
    kind: 'winnerGroup',
    component: WinnerGroup,
  },
  // 8時間フライト
  {
    kind: 'flightSeat',
    component: FlightSeat,
  },
]
