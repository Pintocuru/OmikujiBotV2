// src\MainGenerator\ui\ComponentMapping.ts
import type { Component } from 'vue'
import { ComponentKind } from '@/types'
import CommentBubble from '@main/ui/CommentBubble/CommentBubble.vue'
import ToastWidgets from '@main/ui/ToastWidgets/ToastWidgets.vue'
import GameRankingViewer from '@main/ui/GameRanking/GameRanking.vue'
import CounterPreview from '@main/ui/CounterPreview/CounterPreview.vue'

// コンポーネントマッピング定義
interface ComponentMapping {
  kind: ComponentKind
  component: Component
  classes?: string
  props?: Record<string, any>
  shouldRender?: (ctx: { isComment: boolean; isTimer: boolean }) => boolean // 追加の表示条件
}

export const COMPONENT_MAPPINGS: ComponentMapping[] = [
  {
    kind: 'bubble',
    component: CommentBubble,
    classes: 'z-10 pointer-events-none',
  },
  {
    kind: 'toast',
    component: ToastWidgets,
    classes: 'z-10',
  },
  {
    kind: 'ranking',
    component: GameRankingViewer,
    classes: 'absolute top-0 left-1/2 transform -translate-x-1/2 w-full',
  },
  {
    kind: 'counter',
    component: CounterPreview,
    shouldRender: ({ isComment }) => isComment, // コメント機能が有効な時のみ
  },
  // 将来的な拡張例:
  // {
  //   kind: 'timer',
  //   component: TimerDisplay,
  //   classes: 'absolute bottom-4 left-4',
  // },
  // {
  //   kind: 'poll',
  //   component: PollViewer,
  //   classes: 'absolute top-4 right-4',
  // },
]
