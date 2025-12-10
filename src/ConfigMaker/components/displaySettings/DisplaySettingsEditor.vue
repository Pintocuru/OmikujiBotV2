<!-- src\ConfigMaker\components\displaySettings\DisplaySettingsEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- コンポーネント表示設定 -->
    <SectionCard
      :isOpen="true"
      title="コンポーネント表示設定"
      description="ジェネレーターで表示するコンポーネントの設定"
    >
      <ComponentsconditionEditor />
    </SectionCard>

    <!-- 各コンポーネント設定 -->
    <!-- フキダシコンポーネント -->
    <SectionCard
      :isOpen="activeSection === 'bubbleComponent'"
      @toggle="toggleSection('bubbleComponent')"
      title="フキダシコンポーネント"
      description="BOTが喋るフキダシの設定"
    >
      <BubbleComponentEditor />
    </SectionCard>

    <!-- フキダシコンポーネント：キャラクター -->
    <SectionCard
      :isOpen="activeSection === 'bubbleComponent'"
      @toggle="toggleSection('bubbleComponent')"
      title="フキダシコンポーネント(キャラクター)"
      description="キャラクターの表示位置設定"
    >
      <BubbleComponentCharacterEditor />
    </SectionCard>

    <!-- トーストコンポーネント -->
    <SectionCard
      :isOpen="activeSection === 'toastComponent'"
      @toggle="toggleSection('toastComponent')"
      title="トーストコンポーネント"
      description="お知らせとして表示されるチャット表示"
    >
      <ToastComponentEditor />
    </SectionCard>

    <!-- サムネイルコンポーネント -->
    <SectionCard
      :isOpen="activeSection === 'thumbnailComponent'"
      @toggle="toggleSection('thumbnailComponent')"
      title="サムネイルコンポーネント"
      description="テストでも使えるサムネイル型の画像表示"
    >
      <ThumbnailComponentEditor />
    </SectionCard>

    <!-- ランキングコンポーネント -->
    <SectionCard
      :isOpen="activeSection === 'rankingComponent'"
      @toggle="toggleSection('rankingComponent')"
      title="ランキングコンポーネント"
      description="ゲームスクリプトで使う、ランキング表示"
    >
      <RankingComponentEditor />
    </SectionCard>

    <!-- カウンターコンポーネント -->
    <SectionCard
      :isOpen="activeSection === 'counterComponent'"
      @toggle="toggleSection('counterComponent')"
      title="カウンターコンポーネント"
      description="コメントが来るたびに数値が増えるカウンターの表示"
    >
      <CounterComponentEditor />
    </SectionCard>

    <!-- エディター設定 -->
    <SectionCard
      :isOpen="activeSection === 'editorSettings'"
      @toggle="toggleSection('editorSettings')"
      title="エディター設定"
      description="エディター自体の見た目とライセンスの設定"
    >
      <EditorSettingsEditor />
    </SectionCard>

    <!-- グローバル設定 -->
    <SectionCard
      :isOpen="activeSection === 'globalSettings'"
      @toggle="toggleSection('globalSettings')"
      variant="warning"
      title="起動時設定"
      description="作られたコンポーネントって、まるで育てた自分の子供みたいね。"
    >
      <StartupSettings />
    </SectionCard>

    <!-- 開発者用設定 -->
    <template v-if="isGod">
      <!-- コンポーネント可視性設定 -->
      <SectionCard
        :isOpen="activeSection === 'visibilitySettings'"
        @toggle="toggleSection('visibilitySettings')"
        variant="warning"
        title="コンポーネント可視性設定"
        description="見えるのか…私が…！"
      >
        <VisibilitySettings />
      </SectionCard>

      <!-- 補足説明(´・ω・｀) -->
      <DeveloperModeInfo />
    </template>

    <!-- ！！！！！！ここからは分割！！！！！！！ -->

    <!-- フキダシ設定 -->
    <SectionCard
      :isOpen="activeSection === 'commentBubble'"
      @toggle="toggleSection('commentBubble')"
      title="フキダシ設定"
      description="フキダシの文字とアニメーションに関する設定"
    >
      <CommentBubbleEditor />
    </SectionCard>

    <!-- トースト・サムネイル設定 -->
    <SectionCard
      :isOpen="activeSection === 'toastBubble'"
      @toggle="toggleSection('toastBubble')"
      title="トースト設定"
      description="ジェネレーターで表示する、フキダシ以外の表示設定"
    >
      <ToastBubbleEditor />
    </SectionCard>

    <!-- キャラクター設定 -->
    <SectionCard
      v-if="useVisibilityAccess().canShow('characterVisible')"
      :isOpen="activeSection === 'showCharacter'"
      @toggle="toggleSection('showCharacter')"
      title="キャラクター設定"
      description="ジェネレーターで表示する、フキダシ以外の表示設定"
    >
      <ShowCharacterEditor />
    </SectionCard>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
  import BubbleComponentEditor from './components/BubbleComponentEditor.vue'
  import BubbleComponentCharacterEditor from './components/BubbleComponentCharacterEditor.vue'
  import ToastComponentEditor from './components/ToastComponentEditor.vue'
  import ThumbnailComponentEditor from './components/ThumbnailComponentEditor.vue'
  import RankingComponentEditor from './components/RankingComponentEditor.vue'
  import CounterComponentEditor from './components/CounterComponentEditor.vue'

  import CommentBubbleEditor from './CommentBubbleEditor.vue'
  import ToastBubbleEditor from './ToastBubbleEditor.vue'
  import ShowCharacterEditor from './ShowCharacterEditor.vue'
  import EditorSettingsEditor from './EditorSettingsEditor.vue'
  import StartupSettings from './StartupSettings.vue'
  import VisibilitySettings from './VisibilitySettings.vue'
  import DeveloperModeInfo from './DeveloperModeInfo.vue'
  import SectionCard from '@shared/components/parts/SectionCard.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'
  import { useVisibilityAccess } from '@/ConfigMaker/scripts/useSettingMode'

  // アクティブなセクションの管理
  type SectionType =
    | 'componentsSettings'
    | 'bubbleComponent'
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
  const { isGod } = useSettingMode()
</script>
