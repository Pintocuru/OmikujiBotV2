<!-- src/ConfigMaker/components/display/DisplaySettingsEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- 文字・アニメーション設定 -->
    <SectionCard
      :isOpen="activeSection === 'textAnimation'"
      @toggle="toggleSection('textAnimation')"
      title="文字・アニメーション"
      description="フキダシの文字とアニメーションに関する設定です"
    >
      <TextAnimationEditor />
    </SectionCard>

    <!-- 表示オプション設定 -->
    <SectionCard
      :isOpen="activeSection === 'displayOptions'"
      @toggle="toggleSection('displayOptions')"
      title="表示オプション"
      description="ジェネレーターで表示する、フキダシ以外の表示設定です"
    >
      <DisplayOptionsEditor />
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
  import TextAnimationEditor from './TextAnimationEditor.vue'
  import DisplayOptionsEditor from './DisplayOptionsEditor.vue'
  import EditorSettingsEditor from './EditorSettingsEditor.vue'
  import StartupSettings from './StartupSettings.vue'
  import VisibilitySettings from './VisibilitySettings.vue'
  import DeveloperModeInfo from './DeveloperModeInfo.vue'
  import SectionCard from '@ConfigComponents/parts/SectionCard.vue'
  import { useSettingMode } from '@/ConfigMaker/scripts/useSettingMode'

  // アクティブなセクションの管理
  type SectionType =
    | 'textAnimation'
    | 'displayOptions'
    | 'editorSettings'
    | 'startupSettings'
    | 'visibilitySettings'
    | null
  const activeSection = ref<SectionType>('textAnimation') // 初期状態で文字・アニメーション設定を開く

  // セクションの切り替え
  const toggleSection = (section: SectionType) => {
    activeSection.value = activeSection.value === section ? null : section
  }

  // Store
  const { isGod } = useSettingMode()
</script>
