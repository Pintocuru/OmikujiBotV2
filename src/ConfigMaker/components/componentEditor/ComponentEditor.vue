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
  <!-- フキダシアイテム -->
  <SectionCard
    icon="MessageSquare"
    v-if="conditions.includes('bubble')"
    :isOpen="activeSection === 'bubbleComponent'"
    @toggle="toggleSection('bubbleComponent')"
    title="フキダシアイテム"
    description="BOTが喋るフキダシの設定"
  >
    <BubbleComponentEditor />
  </SectionCard>

  <!-- フキダシアイテム：キャラクター -->
  <SectionCard
    icon="UserSquare"
    v-if="conditions.includes('bubble') && isCharacter"
    :isOpen="activeSection === 'bubbleComponentcharacter'"
    @toggle="toggleSection('bubbleComponentcharacter')"
    title="フキダシアイテム(キャラクター)"
    description="キャラクターの表示位置設定"
  >
    <BubbleComponentCharacterEditor />
  </SectionCard>

  <!-- トースト・サムネイルアイテム -->
  <SectionCard
    icon="Bell"
    v-if="conditions.includes('toast')"
    :isOpen="activeSection === 'toastComponent'"
    @toggle="toggleSection('toastComponent')"
    title="トースト・サムネイルアイテム"
    description="お知らせとして表示されるチャット表示"
  >
    <ToastComponentEditor />
  </SectionCard>

  <!-- ランキングアイテム -->
  <SectionCard
    icon="Trophy"
    v-if="conditions.includes('ranking')"
    :isOpen="activeSection === 'rankingComponent'"
    @toggle="toggleSection('rankingComponent')"
    title="ランキングアイテム"
    description="ゲームスクリプトで使う、ランキング表示"
  >
    <RankingComponentEditor />
  </SectionCard>

  <!-- カウンターアイテム -->
  <SectionCard
    icon="Hash"
    v-if="conditions.includes('counter')"
    :isOpen="activeSection === 'counterComponent'"
    @toggle="toggleSection('counterComponent')"
    title="カウンターアイテム"
    description="コメントが来るたびに数値が増えるカウンターの表示"
  >
    <CounterComponentEditor />
  </SectionCard>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import ComponentConditionsEditor from './ComponentConditionsEditor.vue'
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
    | 'bubbleComponentcharacter'
    | 'toastComponent'
    | 'rankingComponent'
    | 'counterComponent'
    | null
  const activeSection = ref<SectionType>('componentsSettings') // 初期状態で文字・アニメーション設定を開く

  const { isCharacter } = useVisibilityAccess()

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const conditions = computed(() => data.value.components.conditions)
</script>
