<!-- src/ConfigMaker/components/componentEditor/ComponentEditor.vue -->
<template>
  <!-- アイテム表示設定 -->
  <SectionCard
    v-if="hasAccess(itemSlotEnabled)"
    icon="LayoutGrid"
    :isOpen="true"
    title="アイテム表示設定"
    description="ジェネレーターで表示するアイテムの設定"
  >
    <ComponentConditionsEditor />
  </SectionCard>

  <!-- 各アイテム設定 -->
  <template v-for="(item, type) in componentItemMap" :key="type">
    <SectionCard
      v-if="item.shouldShow"
      :icon="item.icon"
      :isOpen="activeSection === type"
      @toggle="toggleSection(type)"
      :title="item.title"
      :description="item.description"
    >
      <component :is="item.component" />
    </SectionCard>
  </template>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'
  import { UiKind } from '@/types/'
  import ComponentConditionsEditor from './conditions/ComponentConditionsEditor.vue'
  import CommentBubbleEditor from './CommentBubble/CommentBubbleEditor.vue'
  import BubbleCharacterEditor from './CommentBubble/BubbleCharacterEditor.vue'
  import ToastComponentEditor from './ToastWidgets/ToastWidgetsEditor.vue'
  import GameRankingEditor from './GameRanking/GameRankingEditor.vue'
  import CounterPreviewEditor from './CounterPreview/CounterPreviewEditor.vue'
  import WinnerGroupEditor from './WinnerGroup/WinnerGroupEditor.vue'
  import FlightSeatEditor from './FlightSeat/FlightSeatEditor.vue'
  import FlashBannerEditor from './FlashBanner/FlashBannerEditor.vue'
  import FontFamilyEditor from './CommonStyle/FontFamilyEditor.vue'
  import DefaultColorEditor from './CommonStyle/DefaultColorEditor.vue'

  import { useAccessChecker, useSettingMode, useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { useFlagsSettings } from '@/ConfigMaker/components/appInfo/FlagsSettings/useFlagsSettings'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isComment, isCharacter } = useVisibilityAccess()
  const { itemSlotEnabled } = useFlagsSettings()
  const { hasAccess } = useAccessChecker()
  const { isPro } = useSettingMode()
  const conditions = computed(() => data.value.components.conditions)

  const activeSection = ref<string | null>('componentsSettings')

  const toggleSection = (section: string) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  const hasComponentKind = (kind: UiKind): boolean => conditions.value.some((c) => c.kind === kind)

  type ComponentItemType =
    | 'bubble'
    | 'bubbleCharacter'
    | 'flashBanner'
    | 'toast'
    | 'ranking'
    | 'counter'
    | 'winnerGroup'
    | 'flightSeat'
    | 'defaultColor'
    | 'fontFamily'

  const componentItemMap: Record<
    ComponentItemType,
    {
      icon: LucideIconName
      title: string
      description: string
      component: any
      shouldShow: boolean
    }
  > = {
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
      description: 'ゲームスクリプトで使う、ランキング表示',
      component: GameRankingEditor,
      shouldShow: hasComponentKind('ranking'),
    },
    counter: {
      icon: 'Hash',
      title: 'カウンターアイテム',
      description: 'コメントが来るたびに数値が増えるカウンターの表示',
      component: CounterPreviewEditor,
      shouldShow: hasComponentKind('counter') && isComment.value,
    },
    winnerGroup: {
      icon: 'Crown',
      title: 'ラッキーメンバーズアイテム',
      description: 'ランダムに選ばれたユーザーの表示',
      component: WinnerGroupEditor,
      shouldShow: hasComponentKind('winnerGroup'),
    },
    flightSeat: {
      icon: 'Plane',
      title: 'フライトシートアイテム',
      description: '8時間フライト、どの席に座る？視聴者の座席配置表示',
      component: FlightSeatEditor,
      shouldShow: hasComponentKind('flightSeat') && isComment.value,
    },
    defaultColor: {
      icon: 'Palette',
      title: 'デフォルトカラー',
      description: 'キャラクターが設定されてない場合のデフォルトカラーを設定',
      component: DefaultColorEditor,
      shouldShow: !isCharacter.value,
    },
    fontFamily: {
      icon: 'Type',
      title: 'フォント',
      description: '各種アイテムのフォントを設定',
      component: FontFamilyEditor,
      shouldShow: isPro.value,
    },
  }
</script>
