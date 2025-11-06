<!-- src/configMaker/components/scriptSettings/ScriptSettingsEditor.vue -->
<template>
  <div v-if="hasScripts">
    <ScriptCard
      v-for="scriptId in gameScripts.filter((key) => key in gameScriptMap)"
      :key="scriptId"
      :script-id="scriptId"
      :script-preset="gameScriptMap[scriptId]"
    />
  </div>
  <div v-else>
    <div class="alert alert-info w-full">
      <Settings class="w-5 h-5 mt-0.5 shrink-0" />
      <div class="space-y-1">利用可能なゲームスクリプトがありません</div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, onMounted } from 'vue'
  import ScriptCard from './ScriptCard.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { gameScriptMap } from '@/common/GameScripts/GameScriptsMap'
  import { DefaultTypes } from '@shared/types'
  import { storeToRefs } from 'pinia'
  import { Settings } from 'lucide-vue-next'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  const { gameScripts } = data.value.displaySettings.developer.visibility ?? []

  const hasScripts = computed(() => gameScripts.some((key) => key in gameScriptMap))

  const cleanupScriptSettings = () => {
    const currentScriptSettings = { ...omikujiStore.data.scriptSettings }
    let hasChanges = false

    for (const scriptId in currentScriptSettings as DefaultTypes) {
      if (!(scriptId in gameScriptMap)) {
        delete currentScriptSettings[scriptId]
        hasChanges = true
        continue
      }

      const scriptPreset = gameScriptMap[scriptId]
      const actualSettings = scriptPreset?.settings

      if (!Array.isArray(actualSettings) || actualSettings.length === 0) {
        continue
      }

      const validSettingIds = new Set(actualSettings.map((s) => s.key))
      const settings = currentScriptSettings[scriptId] as DefaultTypes

      for (const settingId in settings) {
        if (!validSettingIds.has(settingId)) {
          delete settings[settingId]
          hasChanges = true
        }
      }
    }

    if (hasChanges) omikujiStore.updateScriptSettings(currentScriptSettings)
  }

  // 読み込み時に ScriptSettings のクリーンアップを行う
  onMounted(() => {
    cleanupScriptSettings()
  })
</script>
