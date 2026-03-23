<!-- src/ConfigMaker/components/appInfo/FlagsSettings/FlagsGamesSettings.vue -->
<template>
  <SubSectionHeader icon="Gamepad2" title="ゲームスクリプト設定" description="ゲームスクリプト関連の表示制御" />

  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
    <SettingItem
      v-for="(value, key) in gameMetaMap"
      :key="key"
      :label="value.name"
      :description="key"
      :variant="gameScripts.includes(key) ? undefined : 'neutral'"
    >
      <input type="checkbox" class="toggle toggle-warning toggle-sm" :value="key" v-model="gameScripts" />
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
  import SettingItem from '@config/components/parts/SettingItem.vue'
  import SubSectionHeader from '@shared/components/parts/SubSectionHeader.vue'
  import { useFlagsSettings } from './useFlagsSettings'
  import { gameMetaMap } from '@/types/MetaMaps/'

  const { gameScripts } = useFlagsSettings()
</script>
