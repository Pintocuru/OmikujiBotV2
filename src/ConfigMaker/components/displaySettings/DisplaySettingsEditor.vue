<!-- src/ConfigMaker/components/display/DisplaySettingsEditor.vue -->
<template>
 <div class="space-y-4">
  <!-- 表示設定 -->
  <DisplaySettingsCard />

  <!-- おみくじBOT設定 -->

  <!-- 開発者用設定 -->
  <DeveloperModeEditor />
 </div>
</template>

<script setup lang="ts">
import DisplaySettingsCard from './DisplaySettingsCard.vue';
import DeveloperModeEditor from './DeveloperModeEditor.vue';
</script>
