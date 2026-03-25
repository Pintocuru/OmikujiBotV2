<!-- src/ConfigMaker/components/appInfo/settings/LicenseSwitch.vue -->
<template>
  <span class="space-x-1">
    <button class="btn btn-sm btn-primary" @click="set('basic')">
      <User class="w-4 h-4" />
    </button>
    <button class="btn btn-sm btn-info" @click="set('adv')">
      <Zap class="w-4 h-4" />
    </button>
    <button class="btn btn-sm btn-success" @click="set('pro')">
      <Crown class="w-4 h-4" />
    </button>
    <button class="btn btn-sm btn-warning" @click="set('godMode')">
      <Sparkles class="w-4 h-4" />
    </button>
  </span>
</template>

<script setup lang="ts">
  import { User, Zap, Crown, Sparkles } from 'lucide-vue-next'
  import { getKey } from '@/common/FeatureAccess/SettingMode'
  import { useOmikujiStore } from '@config/stores/useOmikujiStore'
  import { AccessLevelType } from '@shared/types'

  const store = useOmikujiStore()

  const set = (mode: AccessLevelType) => {
    const value = getKey(mode)
    store.updateSettings({ licenseKeyHash: value })
  }
</script>
