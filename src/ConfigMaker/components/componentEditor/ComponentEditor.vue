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
      :isOpen="activeSection === item.sectionKey"
      @toggle="toggleSection(item.sectionKey)"
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

  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useVisibilityAccess } from '@config/scripts/useAccessCheckerConfig'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  // アクティブなセクションの管理
  type SectionType =
    | 'componentsSettings'
    | 'bubbleComponent'
    | 'bubbleComponentCharacter'
    | 'toastComponent'
    | 'rankingComponent'
    | 'counterComponent'
    | null
  const activeSection = ref<SectionType>('componentsSettings')

  const { isComment, isCharacter } = useVisibilityAccess()

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const conditions = computed(() => data.value.components.conditions)

  // v2.1: conditions から特定の kind が含まれているかチェック
  const hasComponentKind = (kind: string) => {
    return conditions.value.some((condition) => condition.kind === kind)
  }

  // アイテム設定の配列
  const componentItems = computed(() => [
    {
      type: 'bubble',
      sectionKey: 'bubbleComponent' as const,
      icon: 'MessageSquare',
      title: 'フキダシアイテム',
      description: 'BOTが喋るフキダシの設定',
      component: BubbleComponentEditor,
      shouldShow: hasComponentKind('bubble'),
    },
    {
      type: 'bubbleCharacter',
      sectionKey: 'bubbleComponentCharacter' as const,
      icon: 'UserSquare',
      title: 'フキダシアイテム(キャラクター)',
      description: 'キャラクターの表示位置設定',
      component: BubbleComponentCharacterEditor,
      shouldShow: hasComponentKind('bubble') && isCharacter.value,
    },
    {
      type: 'toast',
      sectionKey: 'toastComponent' as const,
      icon: 'Bell',
      title: 'トースト・サムネイルアイテム',
      description: 'お知らせとして表示されるチャット表示',
      component: ToastComponentEditor,
      shouldShow: hasComponentKind('toast'),
    },
    {
      type: 'ranking',
      sectionKey: 'rankingComponent' as const,
      icon: 'Trophy',
      title: 'ランキングアイテム',
      description: 'ゲームスクリプトで使う、ランキング表示',
      component: RankingComponentEditor,
      shouldShow: hasComponentKind('ranking'),
    },
    {
      type: 'counter',
      sectionKey: 'counterComponent' as const,
      icon: 'Hash',
      title: 'カウンターアイテム',
      description: 'コメントが来るたびに数値が増えるカウンターの表示',
      component: CounterComponentEditor,
      shouldShow: hasComponentKind('counter') && isComment.value,
    },
  ])
</script>