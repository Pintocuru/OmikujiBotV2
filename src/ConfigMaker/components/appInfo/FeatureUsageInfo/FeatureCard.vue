<!-- src\ConfigMaker\components\appInfo\FeatureUsageInfo\FeatureCard.vue -->
<template v-slot:FeatureCard="{ title, icon, accessLevel, description }">
  <div v-if="hasAccess(accessLevel)" class="card bg-base-200 border-2" :class="getAccessLevelClass(accessLevel)">
    <div class="card-body p-4">
      <div class="flex items-start gap-3">
        <div class="p-2 rounded-lg" :class="getIconBgClass(accessLevel)">
          <component :is="icon" class="w-8 h-8" />
        </div>
        <div class="flex-1">
          <h4 class="font-bold">{{ title }}</h4>
          <p class="text-sm opacity-70 mt-1">{{ description }}</p>
        </div>
        <!-- 右上のチェックボックス(飾り) -->
        <CheckCircle class="w-5 h-5 text-success" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { hasAccess } from '@/ConfigMaker/scripts/useSettingMode'
  import type { AccessLevelType } from '@shared/types'
  import { CheckCircle } from 'lucide-vue-next'

  defineProps<{
    title: string
    icon: any
    accessLevel: AccessLevelType
    description: string
  }>()

  function getAccessLevelClass(level: AccessLevelType): string {
    if (!hasAccess(level)) return 'border-base-300 opacity-60'
    return 'border-success'
  }

  function getIconBgClass(level: AccessLevelType): string {
    if (!hasAccess(level)) return 'bg-base-300'
    return 'bg-success/20 text-success'
  }
</script>
