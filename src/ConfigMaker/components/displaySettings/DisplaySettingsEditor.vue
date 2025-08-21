<!-- src/ConfigMaker/components/display/DisplaySettingsEditor.vue -->
<template>
  <div class="space-y-4">
    <!-- 文字・アニメーション設定 -->
    <TextAnimationEditor />

    <!-- 表示オプション設定 -->
    <DisplayOptionsEditor />

    <!-- エディター設定 -->
    <EditorSettingsEditor />

    <!-- 開発者用設定 -->
    <DeveloperModeEditor />
  </div>
</template>

<script setup lang="ts">
  import TextAnimationEditor from './TextAnimationEditor.vue'
  import DisplayOptionsEditor from './DisplayOptionsEditor.vue'
  import EditorSettingsEditor from './EditorSettingsEditor.vue'
  import DeveloperModeEditor from './DeveloperModeEditor.vue'
</script>
