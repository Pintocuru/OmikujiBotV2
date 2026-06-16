// src/ConfigMaker/UiEditor/useUiItemMap.ts
import CommentBubbleEditor from './CommentBubble/CommentBubbleEditor.vue'
import BubbleCharacterEditor from './CommentBubble/BubbleCharacterEditor.vue'
import ToastComponentEditor from './ToastWidgets/ToastWidgetsEditor.vue'
import GameRankingEditor from './GameRanking/GameRankingEditor.vue'
import CounterPreviewEditor from './CounterPreview/CounterPreviewEditor.vue'
import StreamCounterEditor from './StreamCounter/StreamCounterEditor.vue'
import CookieCounterEditor from './CookieCounter/CookieCounterEditor.vue'
import WinnerGroupEditor from './WinnerGroup/WinnerGroupEditor.vue'
import FlightSeatEditor from './FlightSeat/FlightSeatEditor.vue'
import SocialRosterEditor from './SocialRoster/SocialRosterEditor.vue'
import FlashBannerEditor from './FlashBanner/FlashBannerEditor.vue'
import CommentSpinEditor from './CommentSpin/CommentSpinEditor.vue'
import FontFamilyEditor from './CommonStyle/FontFamilyEditor.vue'
import DefaultColorEditor from './CommonStyle/DefaultColorEditor.vue'
import DeadAirEditor from './DeadAir/DeadAirEditor.vue'
import KujibikiPanelEditor from './KujibikiPanel/KujibikiPanelEditor.vue'
import LiveClockEditor from './LiveClock/LiveClockEditor.vue'
import GiftRankingEditor from './GiftRanking/GiftRankingEditor.vue'
import type { LucideIconName } from '@shared/utils/LucideIcon/useLucideIcon'
import { UiKind } from '@/types'

export type VisibilityKey =
  | 'comment'
  | 'character'
  | '!character'
  | 'primarySlot'
  | 'secondarySlot'
  | 'botSlot'
  | 'allSlot'
  | 'adv'
  | 'pro'
  | 'god'

type UiItem = {
  icon: LucideIconName
  title: string
  description: string
  component: any
  targetKey: UiKind | null
  visibility: VisibilityKey[]
}

export const uiItemMap: Record<string, UiItem> = {
  bubble: {
    icon: 'MessageSquare',
    title: 'フキダシアイテム',
    description: 'BOTが喋るフキダシの設定',
    component: CommentBubbleEditor,
    targetKey: 'bubble',
    visibility: [],
  },

  bubbleCharacter: {
    icon: 'UserSquare',
    title: 'フキダシアイテム(キャラクター)',
    description: 'キャラクターの表示位置設定',
    component: BubbleCharacterEditor,
    targetKey: 'bubble',
    visibility: ['character'],
  },

  liveClock: {
    icon: 'Clock',
    title: 'ライブクロックアイテム',
    description: '',
    component: LiveClockEditor,
    targetKey: 'liveClock',
    visibility: [],
  },

  flashBanner: {
    icon: 'Megaphone',
    title: 'ニュースアイテム',
    description: 'ニュースバナー風のフキダシ設定',
    component: FlashBannerEditor,
    targetKey: 'flashBanner',
    visibility: [],
  },

  commentSpin: {
    icon: 'UserSquare',
    title: 'コメントスピンアイテム',
    description: 'ランダムなテキストをアニメーションで表示',
    component: CommentSpinEditor,
    targetKey: 'commentSpin',
    visibility: [],
  },

  toast: {
    icon: 'Bell',
    title: 'トースト・サムネイルアイテム',
    description: 'お知らせとして表示されるチャット表示',
    component: ToastComponentEditor,
    targetKey: 'toast',
    visibility: [],
  },

  ranking: {
    icon: 'Trophy',
    title: 'ランキングアイテム',
    description: 'ゲームスクリプトで使うランキング表示',
    component: GameRankingEditor,
    targetKey: 'ranking',
    visibility: [],
  },

  counter: {
    icon: 'Hash',
    title: 'カウンターアイテム',
    description: 'コメントごとに増えるカウンター表示',
    component: CounterPreviewEditor,
    targetKey: 'counter',
    visibility: [],
  },

  streamCounter: {
    icon: 'Hash',
    title: 'ライバーカウンターアイテム',
    description: '複数カウンターの表示',
    component: StreamCounterEditor,
    targetKey: 'streamCounter',
    visibility: [],
  },

  cookieCounter: {
    icon: 'Cookie',
    title: 'クッキーカウンターアイテム',
    description: '単数カウンターの表示',
    component: CookieCounterEditor,
    targetKey: 'cookieCounter',
    visibility: [],
  },

  winnerGroup: {
    icon: 'Crown',
    title: 'ラッキーメンバーズアイテム',
    description: 'ランダム選出ユーザー表示',
    component: WinnerGroupEditor,
    targetKey: 'winnerGroup',
    visibility: [],
  },

  flightSeat: {
    icon: 'Plane',
    title: 'フライトシートアイテム',
    description: '視聴者の座席配置表示',
    component: FlightSeatEditor,
    targetKey: 'flightSeat',
    visibility: [],
  },

  socialRoster: {
    icon: 'Users',
    title: 'ソーシャルユーザーリスト',
    description: 'コメントしたユーザーをグリッド表示',
    component: SocialRosterEditor,
    targetKey: 'socialRoster',
    visibility: [],
  },

  deadAir: {
    icon: 'Bomb',
    title: '15分で初コメが来ないと',
    description: 'チャレンジ系',
    component: DeadAirEditor,
    targetKey: 'deadAir',
    visibility: [],
  },

  kujibikiPanel: {
    icon: 'Ticket',
    title: 'くじ引き',
    description: 'おみくじの抽選結果を表示するアイテムを表示',
    component: KujibikiPanelEditor,
    targetKey: 'kujibikiPanel',
    visibility: [],
  },

  GiftRanking: {
    icon: 'Gift',
    title: 'ギフトランキング',
    description: 'ギフト専用のランキング表示',
    component: GiftRankingEditor,
    targetKey: 'GiftRanking',
    visibility: [],
  },

  defaultColor: {
    icon: 'Palette',
    title: 'デフォルトカラー',
    description: 'キャラクター未設定時のカラー設定',
    component: DefaultColorEditor,
    targetKey: null,
    visibility: ['!character', 'botSlot'],
  },

  fontFamily: {
    icon: 'Type',
    title: 'フォント',
    description: '各種アイテムのフォント設定',
    component: FontFamilyEditor,
    targetKey: null,
    visibility: ['pro'],
  },
}
