<!-- src\ConfigMaker\components\displaySettings\DisplaySettingsEditor.vue -->
<template>
  <div class="space-y-4">
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
      description="ジェネレーターで表示する、フキダシ以外の表示設定です"
    >
      <ShowCharacterEditor />
    </SectionCard>

    <!-- エディター設定 -->
    <SectionCard
      :isOpen="activeSection === 'editorSettings'"
      @toggle="toggleSection('editorSettings')"
      title="エディター設定"
      description="エディター自体の見た目とライセンスの設定です"
    >
      <EditorSettingsEditor />
    </SectionCard>

    <!-- 開発者用設定 -->
    <template v-if="isGod">
      <!-- 起動設定 -->
      <SectionCard
        :isOpen="activeSection === 'startupSettings'"
        @toggle="toggleSection('startupSettings')"
        variant="warning"
        title="起動時設定"
        description="作られたコンポーネントって、まるで育てた自分の子供みたいね。"
      >
        <StartupSettings />
      </SectionCard>

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
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue'
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
    | 'commentBubble'
    | 'toastBubble'
    | 'showCharacter'
    | 'editorSettings'
    | 'startupSettings'
    | 'visibilitySettings'
    | null
  const activeSection = ref<SectionType>('commentBubble') // 初期状態で文字・アニメーション設定を開く

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Store
  const { isGod } = useSettingMode()
</script>
