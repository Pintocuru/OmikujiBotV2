<!-- src\ConfigMaker\components\displaySettings\VisibilitySettings.vue -->
<template>
  <div class="space-y-4">
    <!-- プリセットボタン -->
    <div class="flex gap-2">
      <button @click="setFullVisibility" class="btn btn-sm btn-primary">Full</button>
      <button @click="setSoloVisibility" class="btn btn-sm btn-secondary">Solo</button>
    </div>

    <!-- 基本コンポーネントの可視性 -->
    <BasicComponentsVisibility />

    <!-- コンポーネント固有の可視性設定 -->
    <ComponentSpecificVisibility />

    <!-- ゲームスクリプト関連設定 -->
    <GameScriptVisibility />

    <!-- ツール系設定 -->
    <ToolsVisibility />
  </div>
</template>

<script setup lang="ts">
  import BasicComponentsVisibility from './visibility/BasicComponentsVisibility.vue'
  import ComponentSpecificVisibility from './visibility/ComponentSpecificVisibility.vue'
  import GameScriptVisibility from './visibility/GameScriptVisibility.vue'
  import ToolsVisibility from './visibility/ToolsVisibility.vue'
  import { useVisibilitySettings } from './visibility/useVisibilitySettings'

  const { setFullVisibility, setSoloVisibility } = useVisibilitySettings()
</script>
