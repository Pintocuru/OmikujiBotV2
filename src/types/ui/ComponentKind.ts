//src\types\ui\ComponentKind.ts
import z from 'zod'
import CommentBubble from '@main/ui/CommentBubble/CommentBubble.vue'
import ToastWidgets from '@main/ui/ToastWidgets/ToastWidgets.vue'
import GameRankingViewer from '@main/ui/GameRanking/GameRanking.vue'
import CounterPreview from '@main/ui/CounterPreview/CounterPreview.vue'
import WinnerGroup from '@main/ui/WinnerGroup/WinnerGroup.vue'
import FlightSeat from '@main/ui/FlightSeat/FlightSeat.vue'

/**
 * スロット定義
 */
export const ComponentSlotSchema = z.enum(['primary', 'secondary', 'extra'])
export type ComponentSlot = z.infer<typeof ComponentSlotSchema>

/**
 * コンポーネント種類の定義
 */
export interface ComponentMapping {
  slot: ComponentSlot
  label: string
  component: any
  shouldRender?: (ctx: { isComment: boolean; isTimer: boolean }) => boolean // 追加の表示条件
}

export const COMPONENT_DEFINITIONS = {
  bubble: {
    slot: 'primary',
    label: 'フキダシ',
    component: CommentBubble,
  },
  toast: {
    slot: 'secondary',
    label: 'トースト',
    component: ToastWidgets,
  },
  ranking: {
    slot: 'extra',
    label: 'ランキング',
    component: GameRankingViewer,
  },
  counter: {
    slot: 'extra',
    label: 'カウンター',
    component: CounterPreview,
    shouldRender: ({ isComment }) => isComment,
  },
  // ラッキーメンバーズ
  winnerGroup: {
    slot: 'extra',
    label: 'ラッキーメンバーズ',
    component: WinnerGroup,
  },
  // フライトシート
  flightSeat: {
    slot: 'extra',
    label: 'フライトシート',
    component: FlightSeat,
  },
} as const satisfies Record<string, ComponentMapping>

export type ComponentKind = keyof typeof COMPONENT_DEFINITIONS
export const ComponentKindSchema = z.enum(Object.keys(COMPONENT_DEFINITIONS) as [ComponentKind, ...ComponentKind[]])

/**
 * ComponentSlotで使用可能なComponentKindを取得する
 */
export function getKindsForSlot(slot: ComponentSlot): ComponentKind[] {
  return Object.entries(COMPONENT_DEFINITIONS)
    .filter(([_, config]) => config.slot === slot)
    .map(([kind]) => kind as ComponentKind)
}
