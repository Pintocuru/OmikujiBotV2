// src/ConfigMaker/components/UiEditor/useUiItemMap.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useOmikujiStore } from '@config/stores/useOmikujiStore'
import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
import { useSettingMode } from '@config/scripts/useAccessCheckerConfig'

import { UiKind } from '@/types/'
import type { LucideIconName } from '@shared/utils/LucideIcon/useLucideIcon'

import CommentBubbleEditor from '@/ConfigMaker/components/UiEditor/CommentBubble/CommentBubbleEditor.vue'
import BubbleCharacterEditor from '@/ConfigMaker/components/UiEditor/CommentBubble/BubbleCharacterEditor.vue'
import ToastComponentEditor from '@/ConfigMaker/components/UiEditor/ToastWidgets/ToastWidgetsEditor.vue'
import GameRankingEditor from '@/ConfigMaker/components/UiEditor/GameRanking/GameRankingEditor.vue'
import CounterPreviewEditor from '@/ConfigMaker/components/UiEditor/CounterPreview/CounterPreviewEditor.vue'
import StreamCounterEditor from '@/ConfigMaker/components/UiEditor/StreamCounter/StreamCounterEditor.vue'
import WinnerGroupEditor from '@/ConfigMaker/components/UiEditor/WinnerGroup/WinnerGroupEditor.vue'
import FlightSeatEditor from '@/ConfigMaker/components/UiEditor/FlightSeat/FlightSeatEditor.vue'
import SocialRosterEditor from '@/ConfigMaker/components/UiEditor/SocialRoster/SocialRosterEditor.vue'
import FlashBannerEditor from '@/ConfigMaker/components/UiEditor/FlashBanner/FlashBannerEditor.vue'
import FontFamilyEditor from '@/ConfigMaker/components/UiEditor/CommonStyle/FontFamilyEditor.vue'
import DefaultColorEditor from '@/ConfigMaker/components/UiEditor/CommonStyle/DefaultColorEditor.vue'
import DeadAirEditor from './DeadAir/DeadAirEditor.vue'

type UiItem = {
  icon: LucideIconName
  title: string
  description: string
  component: any
  shouldShow: boolean
}

export const useUiItemMap = () => {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const { isComment, isCharacter, isPrimarySlot, isSecondarySlot } = useVisibilityAccess()
  const { isPro } = useSettingMode()

  const conditions = computed(() => data.value.components.conditions)

  const hasComponentKind = (kind: UiKind) => conditions.value.some((c) => c.kind === kind)

  const uiItemMap = computed<Record<string, UiItem>>(() => ({
    bubble: {
      icon: 'MessageSquare',
      title: 'フキダシアイテム',
      description: 'BOTが喋るフキダシの設定',
      component: CommentBubbleEditor,
      shouldShow: hasComponentKind('bubble'),
    },
    bubbleCharacter: {
      icon: 'UserSquare',
      title: 'フキダシアイテム(キャラクター)',
      description: 'キャラクターの表示位置設定',
      component: BubbleCharacterEditor,
      shouldShow: hasComponentKind('bubble') && isCharacter.value,
    },
    flashBanner: {
      icon: 'Megaphone',
      title: 'ニュースアイテム',
      description: 'ニュースバナー風のフキダシ設定',
      component: FlashBannerEditor,
      shouldShow: hasComponentKind('flashBanner'),
    },
    toast: {
      icon: 'Bell',
      title: 'トースト・サムネイルアイテム',
      description: 'お知らせとして表示されるチャット表示',
      component: ToastComponentEditor,
      shouldShow: hasComponentKind('toast'),
    },
    ranking: {
      icon: 'Trophy',
      title: 'ランキングアイテム',
      description: 'ゲームスクリプトで使うランキング表示',
      component: GameRankingEditor,
      shouldShow: hasComponentKind('ranking'),
    },
    counter: {
      icon: 'Hash',
      title: 'カウンターアイテム',
      description: 'コメントごとに増えるカウンター表示',
      component: CounterPreviewEditor,
      shouldShow: hasComponentKind('counter') && isComment.value,
    },
    streamCounter: {
      icon: 'Hash',
      title: 'ライバーカウンターアイテム',
      description: '複数カウンターの表示',
      component: StreamCounterEditor,
      shouldShow: hasComponentKind('streamCounter'),
    },
    winnerGroup: {
      icon: 'Crown',
      title: 'ラッキーメンバーズアイテム',
      description: 'ランダム選出ユーザー表示',
      component: WinnerGroupEditor,
      shouldShow: hasComponentKind('winnerGroup'),
    },
    flightSeat: {
      icon: 'Plane',
      title: 'フライトシートアイテム',
      description: '視聴者の座席配置表示',
      component: FlightSeatEditor,
      shouldShow: hasComponentKind('flightSeat'),
    },
    socialRoster: {
      icon: 'Users',
      title: 'ソーシャルユーザーリスト',
      description: 'コメントしたユーザーをソーシャルゲーム風のグリッドで一覧表示します',
      component: SocialRosterEditor,
      shouldShow: hasComponentKind('socialRoster'),
    },
    deadAir: {
      icon: 'Bomb',
      title: '15分で初コメが来ないと',
      description: 'チャレンジ系',
      component: DeadAirEditor,
      shouldShow: hasComponentKind('deadAir'),
    },
    defaultColor: {
      icon: 'Palette',
      title: 'デフォルトカラー',
      description: 'キャラクター未設定時のカラー設定',
      component: DefaultColorEditor,
      shouldShow: !isCharacter.value && (isPrimarySlot.value || isSecondarySlot.value),
    },
    fontFamily: {
      icon: 'Type',
      title: 'フォント',
      description: '各種アイテムのフォント設定',
      component: FontFamilyEditor,
      shouldShow: isPro.value,
    },
  }))

  return { uiItemMap }
}
