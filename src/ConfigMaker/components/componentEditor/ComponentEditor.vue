<!-- src\ConfigMaker\components\componentEditor\ComponentEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- コンポーネント表示設定 -->
    <SectionCard
      :isOpen="true"
      title="コンポーネント表示設定"
      description="ジェネレーターで表示するコンポーネントの設定"
    >
      <ComponentConditionsEditor />
    </SectionCard>

    <!-- 各コンポーネント設定 -->
    <!-- フキダシコンポーネント -->
    <SectionCard
      v-if="conditions.includes('bubble')"
      :isOpen="activeSection === 'bubbleComponent'"
      @toggle="toggleSection('bubbleComponent')"
      title="💬 フキダシコンポーネント"
      description="BOTが喋るフキダシの設定"
    >
      <BubbleComponentEditor />
    </SectionCard>

    <!-- フキダシコンポーネント：キャラクター -->
    <SectionCard
      v-if="conditions.includes('bubble')"
      :isOpen="activeSection === 'bubbleComponentcharacter'"
      @toggle="toggleSection('bubbleComponentcharacter')"
      title="💬 フキダシコンポーネント(キャラクター)"
      description="キャラクターの表示位置設定"
    >
      <BubbleComponentCharacterEditor />
    </SectionCard>

    <!-- トースト・サムネイルコンポーネント -->
    <SectionCard
      v-if="conditions.includes('toast')"
      :isOpen="activeSection === 'toastComponent'"
      @toggle="toggleSection('toastComponent')"
      title="🍞 トースト・サムネイルコンポーネント"
      description="お知らせとして表示されるチャット表示"
    >
      <ToastComponentEditor />
    </SectionCard>

    <!-- ランキングコンポーネント -->
    <SectionCard
      v-if="conditions.includes('ranking')"
      :isOpen="activeSection === 'rankingComponent'"
      @toggle="toggleSection('rankingComponent')"
      title="🏆 ランキングコンポーネント"
      description="ゲームスクリプトで使う、ランキング表示"
    >
      <RankingComponentEditor />
    </SectionCard>

    <!-- カウンターコンポーネント -->
    <SectionCard
      v-if="conditions.includes('counter')"
      :isOpen="activeSection === 'counterComponent'"
      @toggle="toggleSection('counterComponent')"
      title="🔢 カウンターコンポーネント"
      description="コメントが来るたびに数値が増えるカウンターの表示"
    >
      <CounterComponentEditor />
    </SectionCard>

    <!-- エディター設定
    <SectionCard
      :isOpen="activeSection === 'editorSettings'"
      @toggle="toggleSection('editorSettings')"
      title="エディター設定"
      description="エディターのテーマとライセンスの設定"
    >
      <EditorSettingsEditor />
    </SectionCard>
     -->

    <template v-if="isGod">
      <!-- コンポーネント可視性設定
      <SectionCard
        :isOpen="activeSection === 'visibilitySettings'"
        @toggle="toggleSection('visibilitySettings')"
        variant="warning"
        title="コンポーネント可視性設定"
        description="見えるのか…私が…！"
      >
        <VisibilitySettings />
      </SectionCard> -->

      <!-- 補足説明(´・ω・｀)
      <DeveloperModeInfo /> -->
    </template>
  </div>
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
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { useOmikujiStore } from '@/ConfigMaker/stores/useOmikujiStore'
  import { storeToRefs } from 'pinia'

  // アクティブなセクションの管理
  type SectionType =
    | 'componentsSettings'
    | 'bubbleComponent'
    | 'bubbleComponentcharacter'
    | 'toastComponent'
    | 'thumbnailComponent'
    | 'rankingComponent'
    | 'counterComponent'
    | 'globalSettings'
    | 'toastBubble'
    | 'showCharacter'
    | 'editorSettings'
    | 'visibilitySettings'
    | null
  const activeSection = ref<SectionType>('componentsSettings') // 初期状態で文字・アニメーション設定を開く

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
  const { isGod } = useSettingMode()

  //
  const conditions = computed(() => data.value.displaySettings.components.conditions)
</script>
