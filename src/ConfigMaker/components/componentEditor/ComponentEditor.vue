<!-- src\ConfigMaker\components\componentEditor\ComponentEditor.vue -->
<template>
  <!-- アイテム表示設定 -->
  <SectionCard
    icon="LayoutGrid"
    :isOpen="true"
    title="アイテム表示設定"
    description="ジェネレーターで表示するアイテムの設定"
  >
    <ComponentConditionsEditor />
  </SectionCard>

  <!-- 各アイテム設定 -->
  <template v-for="item in componentItems" :key="item.type">
    <SectionCard
      v-if="item.shouldShow"
      :icon="item.icon"
      :isOpen="activeSection === item.type"
      @toggle="toggleSection(item.type)"
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
  import { UiKind } from '@/types/ui/ComponentKind'
  import ComponentConditionsEditor from './conditions/ComponentConditionsEditor.vue'
  import CommentBubbleEditor from './CommentBubble/CommentBubbleEditor.vue'
  import BubbleCharacterEditor from './CommentBubble/BubbleCharacterEditor.vue'
  import ToastComponentEditor from './ToastWidgets/ToastWidgetsEditor.vue'
  import GameRankingEditor from './GameRanking/GameRankingEditor.vue'
  import CounterPreviewEditor from './CounterPreview/CounterPreviewEditor.vue'
  import WinnerGroupEditor from './WinnerGroup/WinnerGroupEditor.vue'
  import FlightSeatEditor from './FlightSeat/FlightSeatEditor.vue'
  import FlashBannerEditor from './FlashBanner/FlashBannerEditor.vue'
  import CommonStyleEditor from './CommonStyle/CommonStyleEditor.vue'
  import { useSettingMode, useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import SectionCard from '@shared/components/parts/SectionCard.vue'

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isComment, isCharacter } = useVisibilityAccess()
  const { isAdv } = useSettingMode()
  const conditions = computed(() => data.value.components.conditions)

  const activeSection = ref<string | null>('componentsSettings')

  const toggleSection = (section: string) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  const hasComponentKind = (kind: UiKind): boolean => conditions.value.some((c) => c.kind === kind)

  const componentItems = computed(() => [
    // フキダシ
    {
      type: 'bubble',
      icon: 'MessageSquare',
      title: 'フキダシアイテム',
      description: 'BOTが喋るフキダシの設定',
      component: CommentBubbleEditor,
      shouldShow: hasComponentKind('bubble'),
    },
    // フキダシ(キャラクター)
    {
      type: 'bubbleCharacter',
      icon: 'UserSquare',
      title: 'フキダシアイテム(キャラクター)',
      description: 'キャラクターの表示位置設定',
      component: BubbleCharacterEditor,
      shouldShow: hasComponentKind('bubble') && isCharacter.value,
    },
    // ニュースバナー
    {
      type: 'flashBanner',
      icon: 'Megaphone',
      title: 'ニュースアイテム',
      description: 'ニュースバナー風のフキダシ設定',
      component: FlashBannerEditor,
      shouldShow: hasComponentKind('flashBanner'),
    },
    // トースト・サムネイル
    {
      type: 'toast',
      icon: 'Bell',
      title: 'トースト・サムネイルアイテム',
      description: 'お知らせとして表示されるチャット表示',
      component: ToastComponentEditor,
      shouldShow: hasComponentKind('toast'),
    },
    // ランキング
    {
      type: 'ranking',
      icon: 'Trophy',
      title: 'ランキングアイテム',
      description: 'ゲームスクリプトで使う、ランキング表示',
      component: GameRankingEditor,
      shouldShow: hasComponentKind('ranking'),
    },
    // カウンター
    {
      type: 'counter',
      icon: 'Hash',
      title: 'カウンターアイテム',
      description: 'コメントが来るたびに数値が増えるカウンターの表示',
      component: CounterPreviewEditor,
      shouldShow: hasComponentKind('counter') && isComment.value,
    },
    // ラッキーメンバーズ
    {
      type: 'winnerGroup',
      icon: 'Crown',
      title: 'ラッキーメンバーズアイテム',
      description: 'ランダムに選ばれたユーザーの表示',
      component: WinnerGroupEditor,
      shouldShow: hasComponentKind('winnerGroup'),
    },
    // フライトシート
    {
      type: 'flightSeat',
      icon: 'Plane',
      title: 'フライトシートアイテム',
      description: '8時間フライト、どの席に座る？視聴者の座席配置表示',
      component: FlightSeatEditor,
      shouldShow: hasComponentKind('flightSeat') && isComment.value,
    },
    // フォントファミリー
    {
      type: 'commonStyle',
      icon: 'Type',
      title: 'フォント',
      description: '各種アイテムのフォントを設定',
      component: CommonStyleEditor,
      shouldShow: isAdv.value,
    },
  ])
</script>
