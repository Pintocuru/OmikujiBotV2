<!-- src/ConfigMaker/components/display/DeveloperModeEditor.vue -->
<template>
  <div>
    <!-- GOD-MODEがOFFの時のGODボタン -->
    <div v-if="isDev && !data.displaySettings.developer.godModeEnabled">
      <div class="flex flex-wrap gap-4 p-4">
        <div class="alert alert-warning w-full">
          <Info class="w-5 h-5 mt-0.5 shrink-0" />
          <!-- 開発者モードの有効化 -->
          <SettingItem label="開発者モードAgain" description="「開発者モード」を再び表示させる" :showReset="false">
            <label class="label cursor-pointer justify-start gap-3">
              <input
                v-model="data.displaySettings.developer.godModeEnabled"
                type="checkbox"
                class="toggle toggle-warning"
              />
              <span class="label-text">この項目は、isDev がtrueの時のみ表示されます</span>
            </label>
          </SettingItem>
        </div>
      </div>
    </div>

    <div v-if="data.displaySettings.developer.godModeEnabled" class="space-y-4">
      <!-- 開発者モード設定 -->
      <DeveloperModeSettings />

      <!-- 起動設定 -->
      <StartupSettings />

      <!-- コンポーネント可視性設定 -->
      <VisibilitySettings />

      <!-- 補足説明(´・ω・｀) -->
      <DeveloperModeInfo />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { isDev } from '@/types/'
  import DeveloperModeSettings from './DeveloperModeSettings.vue'
  import StartupSettings from './StartupSettings.vue'
  import VisibilitySettings from './VisibilitySettings.vue'
  import DeveloperModeInfo from './DeveloperModeInfo.vue'
  import SettingItem from '@ConfigComponents/parts/SettingItem.vue'
  import { useOmikujiStore } from '@ConfigStores/useOmikujiStore'
  import { storeToRefs } from 'pinia'
  import { Info } from 'lucide-vue-next'

  // Store
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)
</script>
