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
  import ComponentConditionsEditor from './conditions/ComponentConditionsEditor.vue'
  import BubbleComponentEditor from './bubble/BubbleComponentEditor.vue'
  import BubbleComponentCharacterEditor from './bubble/BubbleComponentCharacterEditor.vue'
  import ToastComponentEditor from './toast/ToastComponentEditor.vue'
  import RankingComponentEditor from './ranking/RankingComponentEditor.vue'
  import CounterComponentEditor from './counter/CounterComponentEditor.vue'
  import FlightSeatComponentEditor from './flightSeat/FlightSeatComponentEditor.vue'

  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { ComponentKind } from '@/types'

  const activeSection = ref<string | null>('componentsSettings')
  const { isComment, isCharacter } = useVisibilityAccess()

  const toggleSection = (section: string) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const conditions = computed(() => data.value.components.conditions)

  const hasComponentKind = (kind: ComponentKind): boolean => conditions.value.some((c) => c.kind === kind)

  const componentItems = computed(() => [
    // フキダシ
    {
      type: 'bubble',
      icon: 'MessageSquare',
      title: 'フキダシアイテム',
      description: 'BOTが喋るフキダシの設定',
      component: BubbleComponentEditor,
      shouldShow: hasComponentKind('bubble'),
    },
    // フキダシ(キャラクター)
    {
      type: 'bubbleCharacter',
      icon: 'UserSquare',
      title: 'フキダシアイテム(キャラクター)',
      description: 'キャラクターの表示位置設定',
      component: BubbleComponentCharacterEditor,
      shouldShow: hasComponentKind('bubble') && isCharacter.value,
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
      component: RankingComponentEditor,
      shouldShow: hasComponentKind('ranking'),
    },
    // カウンター
    {
      type: 'counter',
      icon: 'Hash',
      title: 'カウンターアイテム',
      description: 'コメントが来るたびに数値が増えるカウンターの表示',
      component: CounterComponentEditor,
      shouldShow: hasComponentKind('counter') && isComment.value,
    },
    // フライトシート
    {
      type: 'flightSeat',
      icon: 'Plane',
      title: 'フライトシートアイテム',
      description: '8時間フライト、どの席に座る？視聴者の座席配置表示',
      component: FlightSeatComponentEditor,
      shouldShow: hasComponentKind('flightSeat') && isComment.value,
    },
  ])
</script>
